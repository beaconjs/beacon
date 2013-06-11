var db = require("../db.js").sequelize;
var DataTypes = require("sequelize");

var BugAttachment = function(bug_id, filename, screenshot) {
 this.bug_id = bug_id, 
 this.filename = filename,
 this.screenshot = screenshot
};

var bugAttachments_table = db.define('bug_attachments', {
      filename: DataTypes.STRING,
      screenshot: DataTypes.TEXT,
      bug_id: DataTypes.INTEGER
    }, { 
      timestamps: false,
      underscored: true
    });

exports.get=BugAttachment;
exports.table=bugAttachments_table;

BugAttachment.prototype.save=function(onSuccess, onError) {
  if (!this.id) {
    bugAttachments_table.build(this).save().success(onSuccess).error(onError);
  }
};

BugAttachment.forBug=function(bugId, onSuccess, onError) {
    bugAttachments_table.findAll({ where: { bug_id: bugId } }).success(onSuccess).error(onError);
};

BugAttachment.get=function(id, bugId, onSuccess, onError) {
    bugAttachments_table.find({ where: { id: id, bug_id: bugId } }).success(onSuccess).error(onError);
};

BugAttachment.find=function(bugId, filename, onSuccess, onError) {
    bugAttachments_table.find({ where: { filename: filename, bug_id: bugId } }).success(onSuccess).error(onError);
};
