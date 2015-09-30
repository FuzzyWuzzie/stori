// Get the packages we need
var express = require('express');
var bodyParser = require('body-parser');
var Sequelize = require('sequelize');
var bcrypt = require('bcryptjs');
var DB = require('./DB.js');

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
var models = DB.Models(sequelize, Sequelize);
var projectController = require('./controllers/projects.js')(models);
var userController = require('./controllers/users.js')(models);

var app = express();
var port = process.env.PORT || 5000;
app.use(express.static('template'));
app.use(bodyParser.urlencoded({
  extended: true
}));

var jsonError = function(err, req, res, next) {
  res.status(400);
  res.json(err);
};

var router = express.Router();
router.use(jsonError);

router.route('/projects')
  .post(projectController.postProjects)
  .get(projectController.getProjects);
  
router.route('/project/:project_id')
  .get(projectController.getProject)
  .put(projectController.putProject)
  .delete(projectController.deleteProject);
  
router.route('/users')
  .post(userController.postUsers)
  .get(userController.getUsers);

// Register all our routes with /api
app.use('/api', router);

// Initialize the databases and start the server
sequelize.sync().then(function() {
	app.listen(port);
	console.log('listening on *:' + port);
})