var db = require("../db.js").sequelize;
var DataTypes = require("sequelize");

var Project = require('./project').table;
var User = require('./users').table;
var Role = require('./roles').table;

var ProjectUser = function(project_id, user_id, role_id) {
 this.project_id = project_id, 
 this.user_id = user_id, 
 this.role_id = role_id
};

var pusers_table = db.define('project_users', {
      project_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      role_id: DataTypes.INTEGER
    }, { 
      timestamps: false,
      underscored: true
    });

pusers_table.belongsTo(User);
pusers_table.belongsTo(Project);
pusers_table.belongsTo(Role);

Role.hasMany(pusers_table);
Project.hasMany(pusers_table);
User.hasMany(pusers_table);

ProjectUser.prototype.save=function(onSuccess, onError) {
    pusers_table.build(this).save().success(onSuccess).error(onError);
};

ProjectUser.list=function(project_id, onSuccess, onError) {
    pusers_table.all({ include: [ Project, User, Role ], where: {project_id: project_id } }).success(onSuccess).error(onError);
};

ProjectUser.forUser=function(user_id, onSuccess, onError) {
    pusers_table.all({ include: [ Project ], where: {user_id: user_id } }).success(onSuccess).error(onError);
};

exports.get=ProjectUser;
exports.table=pusers_table;
