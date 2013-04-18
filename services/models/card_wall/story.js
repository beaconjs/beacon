var db = require("../../db.js").sequelize;
var DataTypes = require("sequelize");

var Story = function(title, details, owner, points, sprint, tasks, comments) {
    this.title = title, 
    this.details = details, 
    this.owner = owner, 
    this.points = points, 
    this.sprint = sprint || -1, 
    this.status = 'not_started', 
    this.tasks = tasks, 
    this.comments = comments,
    this.created_at = new Date(), 
    this.modified_at = new Date();
};

var stories_table = function() {
    return db.define('stories', {
      title: DataTypes.STRING,
      details: DataTypes.STRING,
      owner: DataTypes.INTEGER,
      points: DataTypes.INTEGER,
      sprint_id: DataTypes.INTEGER,
      status: DataTypes.STRING,
      created_by: DataTypes.INTEGER,
      created_at: DataTypes.DATE,
      modified_by: DataTypes.INTEGER,
      modified_at: DataTypes.DATE
    });
};

exports.Story=Story;
exports.table=stories_table;
exports.save=function(story) {
    var instance = stories_table().build(story);
    instance.save().success(function(){
        console.log("saved");
    }).error(function(error) {
        console.log(error);
    });
};
