var db = require("../db.js").sequelize;
var DataTypes = require("sequelize");

var Bug = function(title, details, project_id, owner_id, status, priority, created_by) {
 this.title = title, 
 this.details = details, 
 this.owner_id = owner_id, 
 this.project_id = project_id,
 this.status = status, 
 this.priority = priority,
 this.created_by = created_by,
 this.modified_by = created_by,
 this.created_at = new Date(),
 this.modified_at = new Date();
};

var bugs_table = db.define('bugs', {
      title: DataTypes.STRING,
      details: DataTypes.STRING,
      status: DataTypes.STRING,
      priority: DataTypes.STRING,
      project_id: DataTypes.INTEGER,
      owner_id: DataTypes.INTEGER,
      created_by: DataTypes.INTEGER,
      created_at: DataTypes.DATE,
      modified_by: DataTypes.INTEGER,
      modified_at: DataTypes.DATE
    }, { 
      timestamps: false,
      underscored: true
    });

exports.get=Bug;
exports.table=bugs_table;

Bug.prototype.save=function(onSuccess, onError) {
  var bug = this;

  if (!this.id) {
    bugs_table.build(this).save().success(onSuccess).error(onError);
  } else {
    bugs_table.find(this.id).success(function(o) { 
      o.updateAttributes({ title: bug.title, details: bug.details, owner_id: bug.owner_id, status: bug.status, priority: bug.priority, modified_at: new Date(), modified_by: bug.modified_by }).success(onSuccess).error(onError); 
    });
  }
};

Bug.all=function(projectId, onSuccess, onError) {
    bugs_table.findAll({ where: { project_id: projectId } }).success(onSuccess).error(onError);
};

Bug.get=function(projectId, id, onSuccess, onError) {
    bugs_table.find({ where: { id: id, project_id: projectId } }).success(onSuccess).error(onError);
};
