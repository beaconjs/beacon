var db = require("../../db.js").sequelize;
var DataTypes = require("sequelize");

var Story = require('./story').table

var Task = function( title, story_id) {
 this.title = title,
 this.story_id = story_id,
 this.created_at = new Date(),
 this.modified_at = new Date();
};

var tasks_table = db.define('tasks', {
      title: DataTypes.STRING,
      story_id: DataTypes.INTEGER,
      created_by: DataTypes.INTEGER,
      created_at: DataTypes.DATE,
      modified_by: DataTypes.INTEGER,
      modified_at: DataTypes.DATE
    }, { 
      timestamps: false,
      underscored: true
    });


tasks_table.belongsTo(Story);
Story.hasMany(tasks_table);

exports.get=Task;
exports.table=tasks_table;

Task.prototype.save=function(onSuccess, onError) {
    tasks_table.build(this).save().success(onSuccess).error(onError);
};

Task.list = function(story_id, onSuccess, onError) {
  tasks_table.findAll({ where: { story_id: story_id } }).success(onSuccess).error(onError);
};
