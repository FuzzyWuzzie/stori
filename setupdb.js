var Sequelize = require('sequelize');
var bcrypt = require('bcryptjs');

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

var DB = require('./lib/DB.js');
var Models = DB.Models(sequelize, Sequelize);
var User = Models.User;
DB.Initialize(sequelize);