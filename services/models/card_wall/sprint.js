var db = require("../../db.js").sequelize;
var DataTypes = require("sequelize");

var Sprint = function(title, stories, startDate, endDate) {
 this.title = title, 
 this.stories = stories, 
 this.start_date = startDate, 
 this.end_date = endDate,
 this.created_at = new Date(),
 this.modified_at = new Date();
};

var sprints_table = db.define('sprints', {
      title: DataTypes.STRING,
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
      created_by: DataTypes.INTEGER,
      created_at: DataTypes.DATE,
      modified_by: DataTypes.INTEGER,
      modified_at: DataTypes.DATE
    }, { 
      timestamps: false,
      underscored: true
    });

exports.get=Sprint;
exports.table=sprints_table;

Sprint.prototype.save=function(onSuccess, onError) {
    sprints_table.build(this).save().success(onSuccess).error(onError);
};
