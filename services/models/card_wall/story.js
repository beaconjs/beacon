var db = require("../../db.js").sequelize;
var DataTypes = require("sequelize");

var User = require('../users').table
var Epic = require('./epic').table
var Sprint = require('./sprint').table

var Story = function(title, details, owner_id, points, epic_id, sprint_id) {
    this.title = title, 
    this.details = details, 
    this.owner_id = owner_id, 
    this.points = points, 
    this.epic_id = epic_id, 
    this.sprint_id = sprint_id, 
    this.status = 'not_started',
    this.created_at = new Date(), 
    this.modified_at = new Date();
};

var stories_table = db.define('stories', {
      title: DataTypes.STRING,
      details: DataTypes.STRING,
      owner_id: DataTypes.INTEGER,
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

stories_table.belongsTo(Epic);
Epic.hasMany(stories_table);

stories_table.belongsTo(Sprint);
Sprint.hasMany(stories_table);

stories_table.belongsTo(User, { foreignKey: 'owner_id' });
User.hasMany(stories_table, { as: 'owners', foreignKey: 'owner_id' });

exports.get=Story;
exports.table=stories_table;

Story.prototype.save=function(onSuccess, onError) {
    stories_table.build(this).save().success(onSuccess).error(onError);
};

Story.prototype.update=function(onSuccess, onError) {
    this.created_at = undefined;
    this.created_by = undefined;

    stories_table.find(this.id).success(function(o) { 
      o.updateAttributes().success(onSuccess).error(onError); 
    });
};

Story.forEpic = function(epic_id, onSuccess, onError) {
    stories_table.findAll({include: [User, Sprint], where: { epic_id: epic_id }, order: 'sprint_id' }).success(onSuccess).error(onError);
}

Story.forSprint = function(sprint_id, onSuccess, onError) {
    stories_table.findAll({where: { sprint_id: sprint_id } }).success(onSuccess).error(onError);
}

Story.list = function(project_id, onSuccess, onError) {
    stories_table.findAll({include: [Epic], where: { "epics.project_id": project_id } }).success(onSuccess).error(onError);
}
