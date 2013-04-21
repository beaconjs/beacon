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

var stories_table = db.define('stories', {
      title: DataTypes.STRING,
      details: DataTypes.STRING,
      owner: DataTypes.INTEGER,
      points: DataTypes.INTEGER,
      sprint_id: DataTypes.INTEGER,
      epic_id: DataTypes.INTEGER,
      status: DataTypes.STRING,
      created_by: DataTypes.INTEGER,
      created_at: DataTypes.DATE,
      modified_by: DataTypes.INTEGER,
      modified_at: DataTypes.DATE
    }, { 
      timestamps: false,
      underscored: true
    });

exports.get=Story;
exports.table=stories_table;

Story.prototype.save=function(onSuccess, onError) {
    stories_table.build(this).save().success(onSuccess).error(onError);
};

Story.prototype.all=function(onSuccess, onError) {
    stories_table.all().success(onSuccess).error(onError);
};
