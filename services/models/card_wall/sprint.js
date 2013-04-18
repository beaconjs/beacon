var db = require("../../db.js").sequelize;
var DataTypes = require("sequelize");

var Sprint = function(name, stories, startDate, endDate) {
 this.name = name, 
 this.stories = stories, 
 this.start_date = startDate, 
 this.end_date = endDate,
 this.created_at = new Date(),
 this.modified_at = new Date();
};

var sprints_table = function() {
    return db.define('sprints', {
      name: DataTypes.STRING,
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
      created_by: DataTypes.INTEGER,
      created_at: DataTypes.DATE,
      modified_by: DataTypes.INTEGER,
      modified_at: DataTypes.DATE
    });
};

exports=Sprint;
exports.table=sprints_table;
exports.save=function(sprint) {
    var instance = sprints_table().build(sprint);
    instance.save().success(function(){
        console.log("saved");
    }).error(function(error) {
        console.log(error);
    });
};
