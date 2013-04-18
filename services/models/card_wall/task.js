var db = require("../../db.js").sequelize;
var DataTypes = require("sequelize");

var Task = function( name) {
 this.name = name,
 this.created_at = new Date(),
 this.modified_at = new Date();
};

var tasks_table = function() {
    return db.define('tasks', {
      name: DataTypes.STRING,
      created_by: DataTypes.INTEGER,
      created_at: DataTypes.DATE,
      modified_by: DataTypes.INTEGER,
      modified_at: DataTypes.DATE
    });
};

exports.Task=Task;
exports.table=tasks_table;
exports.save=function(task) {
    var instance = tasks_table().build(task);
    instance.save().success(function(){
        console.log("saved");
    }).error(function(error) {
        console.log(error);
    });
};
