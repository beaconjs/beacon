var express = require('express'),
    Sequelize = require("sequelize");

// db config
var fs = require('fs');
var dbConfigFile = __dirname + '/database.json';
var dbConfig = null;

var sequelize = null;

var data = fs.readFileSync(dbConfigFile, 'utf8');

dbConfig = JSON.parse(data);

var app = express();

if ('development' == app.get('env')) {
  dbConfig = dbConfig.dev;
  sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password);
}

if ('test' == app.get('env')) {
  dbConfig = dbConfig.test;
  sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password);
}

exports.sequelize = sequelize

