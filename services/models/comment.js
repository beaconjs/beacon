var db = require("../db.js").sequelize;
var DataTypes = require("sequelize");

var Comment = function(title, details, user_id, source_id, source_type) {
 this.title = title, 
 this.details = details, 
 this.user_id = user_id,
 this.source_id = source_id,
 this.source_type = source_type,
 this.created_at = new Date();
};

var comments_table = db.define('comments', {
      title: DataTypes.STRING,
      details: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
      source_id: DataTypes.INTEGER,
      source_type: DataTypes.STRING,
      created_at: DataTypes.DATE
    }, { 
      timestamps: false,
      underscored: true
    });

exports.get=Comment;
exports.table=comments_table;

Comment.prototype.save=function(onSuccess, onError) {
    comments_table.build(this).save().success(onSuccess).error(onError);
};

Comment.forNote=function(noteId, onSuccess, onError) {
    comments_table.findAll({ where: { source_id: noteId, source_type: 'note' } }).success(onSuccess).error(onError);
};

Comment.get=function(id, onSuccess, onError) {
    comments_table.find(id).success(onSuccess).error(onError);
};
