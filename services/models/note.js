var db = require("../db.js").sequelize;
var DataTypes = require("sequelize");

var Note = function(title, details, project_id, created_by) {
 this.title = title, 
 this.details = details, 
 this.project_id = project_id,
 this.created_by = created_by,
 this.modified_by = created_by,
 this.created_at = new Date(),
 this.modified_at = new Date();
};

var notes_table = db.define('notes', {
      title: DataTypes.STRING,
      details: DataTypes.STRING,
      project_id: DataTypes.INTEGER,
      created_by: DataTypes.INTEGER,
      created_at: DataTypes.DATE,
      modified_by: DataTypes.INTEGER,
      modified_at: DataTypes.DATE
    }, { 
      timestamps: false,
      underscored: true
    });

exports.get=Note;
exports.table=notes_table;

Note.prototype.save=function(onSuccess, onError) {
  var note = this;

  if (!this.id) {
    notes_table.build(this).save().success(onSuccess).error(onError);
  } else {
    notes_table.find(this.id).success(function(o) { 
      o.updateAttributes({ title: note.title, details: note.details, modified_at: new Date(), modified_by: note.modified_by }).success(onSuccess).error(onError); 
    });
  }
};

Note.all=function(projectId, onSuccess, onError) {
    notes_table.findAll({ where: { project_id: projectId } }).success(onSuccess).error(onError);
};

Note.get=function(projectId, noteId, onSuccess, onError) {
    notes_table.find({ where: { id: noteId, project_id: projectId } }).success(onSuccess).error(onError);
};
