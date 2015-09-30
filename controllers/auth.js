// load required packages
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;

module.exports = function(userModel) {
	passport.use(new BasicStrategy(
		function(username, password, callback) {
			userModel.findOne({
				where: {
					name: username
				}
			}).then(function(user) {
				// no user found with that username
				if(!user) { return callback(null, false); }
				
				// make sure the password is correct
				user.VerifyPassword(password, function(err, isMatch) {
					if(err) { return callback(err); }
					
					// password did not match
					if(!isMatch) { return callback(null, false); }
					
					// success!
					return callback(null, user);
				});
			}).catch(function(err) {
				return callback(err);
			});
		}
	));
	
	return {
		isAuthenticated: passport.authenticate('basic', { session: false })
	};
}