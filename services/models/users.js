var db = require("../db.js").sequelize;
var crypto = require('crypto');
var DataTypes = require("sequelize");

var User = function(name, username, password, email) {
 this.name = name, 
 this.user_name = username, 
 this.password = password,
 this.email = email
};

var users_table = db.define('users', {
      name: DataTypes.STRING,
      user_name: DataTypes.STRING,
      password: DataTypes.STRING,
      email: DataTypes.STRING
    }, { 
      timestamps: false,
      underscored: true
    });

User.prototype.save=function(onSuccess, onError) {
    var shasum = crypto.createHash('sha512');
    shasum.update(this.password);
    this.password = shasum.digest('hex');

    users_table.build(this).save().success(onSuccess).error(onError);
};

User.find=function(username, password, onSuccess, onError) {
    users_table.find({ where: {user_name: username, password: password}, attributes: ['id', 'name', 'user_name', 'email'] }).success(onSuccess).error(onError);
};

User.lookup=function(name, onSuccess, onError) {
    users_table.findAll( { where : [ "name like ?", '%' + name + '%' ] } ).success(onSuccess).error(onError);
};


exports.get=User;
exports.table=users_table;
