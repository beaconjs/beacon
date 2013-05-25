var db = require("../db.js").sequelize;
var DataTypes = require("sequelize");
var User = require('./users').table

var Todo = function(title, details, project_id, owner_id, status, due_date, created_by) {
 this.title = title, 
 this.details = details, 
 this.owner_id = owner_id, 
 this.project_id = project_id,
 this.status = status, 
 this.due_date = due_date,
 this.created_by = created_by,
 this.modified_by = created_by,
 this.created_at = new Date(),
 this.modified_at = new Date();
};

var todos_table = db.define('todos', {
      title: DataTypes.STRING,
      details: DataTypes.STRING,
      status: DataTypes.STRING,
      project_id: DataTypes.INTEGER,
      due_date: DataTypes.DATE,
      owner_id: DataTypes.INTEGER,
      created_by: DataTypes.INTEGER,
      created_at: DataTypes.DATE,
      modified_by: DataTypes.INTEGER,
      modified_at: DataTypes.DATE
    }, { 
      timestamps: false,
      underscored: true,
      freezeTableName:true
    });

todos_table.belongsTo(User, { foreignKey: 'owner_id' });
User.hasMany(todos_table, { as: 'owners', foreignKey: 'owner_id' });

exports.get=Todo;
exports.table=todos_table;

Todo.prototype.save=function(onSuccess, onError) {
  var todo = this;

  if (!this.id) {
    todos_table.build(this).save().success(onSuccess).error(onError);
  } else {
    todos_table.find(this.id).success(function(o) { 
      o.updateAttributes({ title: todo.title, details: todo.details, owner_id: todo.owner_id, due_date: todo.due_date, status: todo.status, modified_at: new Date(), modified_by: todo.modified_by }).success(onSuccess).error(onError); 
    });
  }
};

Todo.all=function(projectId, onSuccess, onError) {
    todos_table.findAll({ include: [User], where: { project_id: projectId } }).success(onSuccess).error(onError);
};

Todo.get=function(projectId, id, onSuccess, onError) {
    todos_table.find({ where: { id: id, project_id: projectId } }).success(onSuccess).error(onError);
};
