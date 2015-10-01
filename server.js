// Get the packages we need
var express = require('express');
var bodyParser = require('body-parser');
var Sequelize = require('sequelize');
var passport = require('passport');

// connect to the database
var sequelize = new Sequelize('stori', '', '', {
	host: 'localhost',
	dialect: 'sqlite',
	pool: {
		max: 5,
		min: 0,
		idle: 10000
	},
	storage: 'stori.db'
});

// load the database models
var userModel = require('./models/user.js')(sequelize, Sequelize);
var projectModel = require('./models/project.js')(sequelize, Sequelize);
var userProjectModel = require('./models/user_project.js')(userModel, projectModel);

// load the controllers
var userController = require('./controllers/users.js')(userModel);
var projectController = require('./controllers/projects.js')(projectModel);
var authController = require('./controllers/auth.js')(userModel);

// initialize the server
var app = express();
var port = process.env.PORT || 5000;
app.use(express.static('template'));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(passport.initialize());

// set up the REST API
var router = express.Router();
router.use(function(err, req, res, next) {
	res.status(400);
	res.json(err);
});

// JWT login
router.route('/auth')
	.post(authController.postAuth);

// projects
router.route('/projects')
	.post(authController.IsAuthenticated, projectController.postProjects)
	.get(authController.IsAuthenticated, projectController.getProjects);
	
// individual project
router.route('/project/:project_id')
	.get(authController.IsAuthenticated, projectController.getProject)
	.put(authController.IsAuthenticated, projectController.putProject)
	.delete(authController.IsAuthenticated, projectController.deleteProject);
	
// users
router.route('/users')
	.post(userController.postUsers)
	.get(authController.IsAuthenticated, authController.HasLevel(2), userController.getUsers);

// register all the routes to the API
app.use('/api/v1', router);

// initialize the databases and start the server
sequelize.sync().then(function() {
	app.listen(port);
	console.log('listening on *:' + port);
})