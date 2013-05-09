var db = require("../db.js").sequelize;
var DataTypes = require("sequelize");

var User = function(name, username, password) {
 this.name = name, 
 this.userName = username, 
 this.password = password
};

var users_table = db.define('users', {
      name: DataTypes.STRING,
      user_name: DataTypes.STRING,
      password: DataTypes.STRING
    }, { 
      timestamps: false,
      underscored: true
    });

User.prototype.save=function(onSuccess, onError) {
    users_table.build(this).save().success(onSuccess).error(onError);
};

User.find=function(username, password, onSuccess, onError) {
    users_table.find({ where: {user_name: username, password: password}, attributes: ['id', 'name', 'user_name'] }).success(onSuccess).error(onError);
};


exports.get=User;
exports.table=users_table;
