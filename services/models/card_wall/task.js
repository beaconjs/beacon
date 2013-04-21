var db = require("../../db.js").sequelize;
var DataTypes = require("sequelize");

var Task = function( title) {
 this.title = title,
 this.created_at = new Date(),
 this.modified_at = new Date();
};

var tasks_table = db.define('tasks', {
      title: DataTypes.STRING,
      created_by: DataTypes.INTEGER,
      created_at: DataTypes.DATE,
      modified_by: DataTypes.INTEGER,
      modified_at: DataTypes.DATE
    }, { 
      timestamps: false,
      underscored: true
    });

exports.get=Task;
exports.table=tasks_table;

Task.prototype.save=function(onSuccess, onError) {
    tasks_table.build(this).save().success(onSuccess).error(onError);
};
