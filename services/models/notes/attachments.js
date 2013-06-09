var db = require("../../db.js").sequelize;
var DataTypes = require("sequelize");

var NoteAttachment = function(note_id, filename) {
 this.note_id = note_id, 
 this.filename = filename
};

var noteAttachments_table = db.define('note_attachments', {
      filename: DataTypes.STRING,
      note_id: DataTypes.INTEGER
    }, { 
      timestamps: false,
      underscored: true
    });

exports.get=NoteAttachment;
exports.table=noteAttachments_table;

NoteAttachment.prototype.save=function(onSuccess, onError) {
  if (!this.id) {
    noteAttachments_table.build(this).save().success(onSuccess).error(onError);
  }
};

NoteAttachment.forNote=function(noteId, onSuccess, onError) {
    noteAttachments_table.findAll({ where: { note_id: noteId } }).success(onSuccess).error(onError);
};

NoteAttachment.get=function(id, noteId, onSuccess, onError) {
    noteAttachments_table.find({ where: { id: id, note_id: noteId } }).success(onSuccess).error(onError);
};

NoteAttachment.find=function(noteId, filename, onSuccess, onError) {
    noteAttachments_table.find({ where: { filename: filename, note_id: noteId } }).success(onSuccess).error(onError);
};
