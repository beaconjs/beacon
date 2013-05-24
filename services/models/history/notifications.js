var db = require("../../db.js").sequelize;
var DataTypes = require("sequelize");

var User = require('../users').table

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

notifications_table.belongsTo(User, { foreignKey: 'created_by' });
User.hasMany(notifications_table, { as: 'issuers', foreignKey: 'created_by' });

exports.get=Notification;
exports.table=notifications_table;

Notification.prototype.save=function(onSuccess, onError) {
    notifications_table.build(this).save().success(onSuccess).error(onError);
};

Notification.all=function(project_id, onSuccess, onError) {
    notifications_table.findAll({ include: [User], where: { project_id: project_id }, order: "created_at DESC", limit: 100}).success(onSuccess).error(onError);
};
