var express = require('express'),
    Sequelize = require("sequelize");

// db config
var fs = require('fs');
var dbConfigFile = __dirname + '/database.json';
var dbConfig = null;

var sequelize = null;

fs.readFile(dbConfigFile, 'utf8', function (err, data) {
  if (err) {
    console.log('Error: ' + err);
    return;
  }

  dbConfig = JSON.parse(data);

  var app = express();

  if ('development' == app.get('env')) {
      dbConfig = dbConfig.dev;
      sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password);
  }
});

exports = sequelize