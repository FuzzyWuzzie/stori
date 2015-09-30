// Get the packages we need
var express = require('express');
var bodyParser = require('body-parser');
var Sequelize = require('sequelize');
var bcrypt = require('bcryptjs');
var DB = require('./lib/DB.js');

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
var Models = DB.Models(sequelize, Sequelize);

var app = express();

var port = process.env.PORT || 5000;
app.use(express.static('template'));
app.use(bodyParser.urlencoded({
  extended: true
}));

var router = express.Router();

// Initial dummy route for testing
// http://localhost:5000/api
router.get('/', function(req, res) {
  res.json({ message: 'You are running dangerously low on beer!' });
});

// Register all our routes with /api
app.use('/api', router);

// Initialize the databases and start the server
sequelize.sync().then(function() {
	app.listen(port);
	console.log('listening on *:' + port);
})