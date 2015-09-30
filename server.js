// Get the packages we need
var express = require('express');
var bodyParser = require('body-parser');
var Sequelize = require('sequelize');

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

var userModel = require('./models/user.js')(sequelize, Sequelize);
var projectModel = require('./models/project.js')(sequelize, Sequelize);

var userController = require('./controllers/users.js')(userModel);
var projectController = require('./controllers/projects.js')(projectModel);
var passport = require('passport');
var authController = require('./controllers/auth.js')(userModel);

var app = express();
var port = process.env.PORT || 5000;
app.use(express.static('template'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(passport.initialize());

var jsonError = function(err, req, res, next) {
  res.status(400);
  res.json(err);
};

var router = express.Router();
router.use(jsonError);

router.route('/projects')
  .post(authController.IsAuthenticated, projectController.postProjects)
  .get(authController.IsAuthenticated, projectController.getProjects);
  
router.route('/project/:project_id')
  .get(authController.IsAuthenticated, projectController.getProject)
  .put(authController.IsAuthenticated, projectController.putProject)
  .delete(authController.IsAuthenticated, projectController.deleteProject);
  
router.route('/users')
  .post(userController.postUsers)
  .get(authController.IsAuthenticated, authController.HasLevel(2), userController.getUsers);

// Register all our routes with /api
app.use('/api', router);

// Initialize the databases and start the server
sequelize.sync().then(function() {
	app.listen(port);
	console.log('listening on *:' + port);
})