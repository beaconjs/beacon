var db = require("../db.js").sequelize;
var DataTypes = require("sequelize");

var Role = function(name) {
 this.name = name
};

var roles_table = db.define('roles', {
      name: DataTypes.STRING
    }, { 
      timestamps: false,
      underscored: true
    });

Role.list=function(onSuccess, onError) {
    roles_table.all().success(onSuccess).error(onError);
};

Role.findByName=function(name, onSuccess, onError) {
    roles_table.find({ where: { name: name } }).success(onSuccess).error(onError);
};
exports.get=Role;
exports.table=roles_table;
