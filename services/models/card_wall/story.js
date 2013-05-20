var db = require("../../db.js").sequelize;
var DataTypes = require("sequelize");

var User = require('../users').table
var Epic = require('./epic').table
var Sprint = require('./sprint').table
var Lane = require('./lane').table

var Story = function(title, details, owner_id, points, epic_id, sprint_id, created_by, status, created_at, modified_by) {
    this.title = title, 
    this.details = details, 
    this.owner_id = owner_id, 
    this.points = points, 
    this.epic_id = epic_id, 
    this.sprint_id = sprint_id, 
    this.status = status || 'not_started',
    this.created_by = created_by,
    this.modified_by = modified_by || created_by,
    this.created_at = created_at || new Date(), 
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
    obj = this;

    stories_table.find(this.id).success(function(o) { 
      o.updateAttributes(obj).success(onSuccess).error(onError); 
    });
};

Story.forEpic = function(epic_id, onSuccess, onError) {
    stories_table.findAll({include: [User, Sprint], where: { epic_id: epic_id }, order: 'sprint_id' }).success(onSuccess).error(onError);
}

Story.get = function(id, onSuccess, onError) {
    stories_table.find({include: [User, Sprint], where: { id: id }}).success(onSuccess).error(onError);
}

Story.forSprint = function(sprint_id, onSuccess, onError) {
    stories_table.findAll({where: { sprint_id: sprint_id } }).success(onSuccess).error(onError);
}

Story.list = function(project_id, onSuccess, onError) {
    stories_table.findAll({include: [Epic], where: { "epics.project_id": project_id } }).success(onSuccess).error(onError);
}

Story.progress = function(project_id, sprint_id, onSuccess, onError) {
    var summary = { total: {}, completed: {} };

    var base_query = "select count(s.id) as num_of_stories, sum(s.points) as points, s.sprint_id " + 
        "from epics e, stories s where s.epic_id=e.id and e.project_id=" + project_id;
    if (sprint_id) {
        base_query += " and s.sprint_id=" + sprint_id;
    }

    db.query(base_query + " group by s.sprint_id").success(function(o){
      o.forEach(function(x){
        x.sprint_id = x.sprint_id || "none";
        summary.total[x.sprint_id] = {};
        summary.total[x.sprint_id].num_of_stories = x.num_of_stories;
        summary.total[x.sprint_id].points = x.points || 0;
      });

      db.query(base_query + " and s.status in (select status from lanes where end_state=1 and project_id=" + project_id + ")" + " group by s.sprint_id").success(function(c){
          c.forEach(function(x){
            x.sprint_id = x.sprint_id || "none";
            summary.completed[x.sprint_id] = {};
            summary.completed[x.sprint_id].num_of_stories = x.num_of_stories;
            summary.completed[x.sprint_id].points = x.points || 0;
          });

          onSuccess(summary);
      }).error(onError);
    }).error(onError);
}
