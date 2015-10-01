// load required packages
var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var jwt = require('jsonwebtoken');
var moment = require('moment');

module.exports = function(userModel, refreshTokenModel) {
	passport.use(new JwtStrategy({
		secretOrKey: 'puppies', // TODO: use a more secure key
		issuer: 'stori'
	},
	function(payload, done) {
		if(payload.id == undefined || payload.userlevel == undefined) {
			return done(JSON.stringify({ message: "ERROR: Invalid JWT payload!", payload: payload }), false);
		}
		return done(null, {
			id: payload.id,
			level: payload.userlevel
		});
	}));

	var generateJWTToken = function(id, level, refreshToken) {
		return jwt.sign({
			id: id,
			lvl: level,
			refresh: refreshToken
		},
		'puppies',
		{
			issuer: 'stori', expiresInMinutes: 5
		});
	};

	var generateRefreshToken = function(uuid) {
		return jwt.sign({
			uuid: uuid
		},
		'doggies',
		{
			issuer: 'stori'
		});
	};

	var deliverAuthToken = function(res, user, next) {
		// generate a new refresh token
		refreshTokenModel.upsert({ userId: user.id }, {
			where: { userId: user.id }
		}).then(function(updated) {
			refreshTokenModel.findOne({
				where: { userId: user.id }
			}).then(function(refreshToken) {
				// success!
				return res.json({
					access_token: generateJWTToken(
						user.id,
						user.level,
						generateRefreshToken(refreshToken.uuid))
				});
			}).catch(function(err) {
				return next(err);
			});
		}).catch(function(err) {
			return next(err);
		});
	}
	
	return {
		IsAuthenticated: passport.authenticate('jwt', { session: false }),
		HasLevel: function(level) {
			return function(req, res, next) {
				if(req.user.level >= level) return next();
				return res.sendStatus(401);
			};
		},
		postAuth: function(req, res, next) {
			userModel.findOne({
				where: {
					name: req.body.name
				}
			}).then(function(user) {
				// no user found with that username
				if(!user) { return res.sendStatus(401); }
				
				// make sure the password is correct
				user.VerifyPassword(req.body.password, function(err, isMatch) {
					if(err) { return next(err); }
					
					// password did not match
					if(!isMatch) { return res.sendStatus(401); }

					return deliverAuthToken(res, user, next);
				});
			}).catch(function(err) {
				return next(err);
			});
		},
		postRefresh: function(req, res, next) {
			jwt.verify(req.body.token, 'doggies',
				{ issuer: 'stori', ignoreExpiration: true },
				function(err, payload) {
					if(err) return next(err);
					refreshTokenModel.findById(payload.uuid).then(function(refreshToken) {
						// check to see if their refresh request is still valid
						var lastRefreshDate = moment(refreshToken.updatedAt);
						var now = moment();
						var diff = now.diff(lastRefreshDate, 'hours');
						if(diff >= 6) {
							// nope, it's not!
							return res.sendStatus(401);
						}
						else {
							// yup, it is!
							refreshToken.getUser().then(function(user) {
								// success!
								return deliverAuthToken(res, user, next);
							}).catch(function(err) {
								return next(err);
							})
						}
					}).catch(function(err) {
						return next(err);
					});
				});
		}
	};
}