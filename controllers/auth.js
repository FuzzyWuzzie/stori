// load required packages
var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var jwt = require('jsonwebtoken');

module.exports = function(userModel) {
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
					
					// success!
					res.json({
						access_token: jwt.sign(
							{ id: user.id, userlevel: user.userlevel },
							'puppies',
							{ issuer: 'stori', expiresInMinutes: 60 })
					});
				});
			}).catch(function(err) {
				return next(err);
			});
		},
	};
}