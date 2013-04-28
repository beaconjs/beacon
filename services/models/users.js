var db = require("../db.js").sequelize;
var DataTypes = require("sequelize");

var User = function(name, username, password) {
 this.name = name, 
 this.username = username, 
 this.password = password
};

var users_table = db.define('users', {
      name: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING
    }, { 
      timestamps: false,
      underscored: true
    });

exports.get=User;
exports.table=users_table;

User.prototype.save=function(onSuccess, onError) {
    users_table.build(this).save().success(onSuccess).error(onError);
};
