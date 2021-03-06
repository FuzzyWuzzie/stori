module.exports = function(userModel) {
	return {
		postUsers: function(req, res, next) {
			userModel.create({
				name: req.body.name,
				email: req.body.email,
				level: 0,
				password: req.body.password
			}).then(function(user) {
				res.json({
					message: 'User \'' + user.name + '\' (' + user.email + ') added!'
				});
			}).catch(function(err) {
				next(err);
			});
		},
		
		// TODO: remove after development!!!
		getUsers: function(req, res, next) {
			userModel.findAll().then(function(users) {
				res.json(users);
			}).catch(function(err) {
				next(err);
			});
		},
		
		getUser: function(req, res, next) {
			userModel.findById(req.params.user_id).then(function(user) {
				res.json(user);
			}).catch(function(err) {
				next(err);
			})
		},
	};
}