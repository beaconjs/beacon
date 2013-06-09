var db = require("../../db.js").sequelize;
var DataTypes = require("sequelize");

var Todo = require('../todos').table;

var Annotation = function(posx, posy, user_id, note_id, todo_id, filename) {
 this.posx = posx, 
 this.posy = posy, 
 this.user_id = user_id,
 this.note_id = note_id,
 this.todo_id = todo_id,
 this.filename = filename,
 this.created_at = new Date();
};

var annotations_table = db.define('annotations', {
      posx: DataTypes.INTEGER,
      posy: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      note_id: DataTypes.INTEGER,
      todo_id: DataTypes.INTEGER,
      filename: DataTypes.STRING,
      created_at: DataTypes.DATE
    }, { 
      timestamps: false,
      underscored: true
    });

annotations_table.belongsTo(Todo, { foreignKey: 'todo_id' });
Todo.hasMany(annotations_table, { as: 'todos', foreignKey: 'todo_id' });

exports.get=Annotation;
exports.table=annotations_table;

Annotation.prototype.save=function(onSuccess, onError) {
    annotations_table.build(this).save().success(onSuccess).error(onError);
};

Annotation.list=function(id, filename, onSuccess, onError) {
    annotations_table.findAll({ include: [ Todo ], where: { note_id: id, filename: filename } }).success(onSuccess).error(onError);
};
