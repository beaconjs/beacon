var db = require("../../db.js").sequelize;
var DataTypes = require("sequelize");

var Notification = function(text, project_id, created_by) {
 this.text = text,
 this.project_id = project_id,
 this.created_by = created_by,
 this.created_at = new Date();
};

var notifications_table = db.define('notifications', {
      text: DataTypes.STRING,
      project_id: DataTypes.INTEGER,
      created_by: DataTypes.INTEGER,
      created_at: DataTypes.DATE
    }, { 
      timestamps: false,
      underscored: true
    });

exports.get=Notification;
exports.table=notifications_table;

Notification.prototype.save=function(onSuccess, onError) {
    notifications_table.build(this).save().success(onSuccess).error(onError);
};

Notification.all=function(project_id, onSuccess, onError) {
    notifications_table.findAll({ where: { project_id: project_id }, order: "created_at DESC"}).success(onSuccess).error(onError);
};
