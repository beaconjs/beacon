var express = require('express'),
    Sequelize = require("sequelize");

var app = express();
var env = app.get('env') == 'development' ? 'dev' : app.get('env');

// db config
var fs = require('fs');
var dbConfigFile = __dirname + '/database.json';
var data = fs.readFileSync(dbConfigFile, 'utf8');

var dbConfig = JSON.parse(data)[env];
var password = dbConfig.password ? dbConfig.password : null;
var sequelize = new Sequelize(dbConfig.database, dbConfig.user, password, { logging: false });

exports.sequelize = sequelize
