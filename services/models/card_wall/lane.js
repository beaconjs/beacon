var db = require("../../db.js").sequelize;
var DataTypes = require("sequelize");

var Lane = function(name, max_stories, status) {
 this.name = name, 
 this.max_stories = max_stories, 
 this.status = status,
 this.created_at = new Date(),
 this.modified_at = new Date();
};

var lanes_table = db.define('lanes', {
      name: DataTypes.STRING,
      max_stories: DataTypes.INTEGER,
      status: DataTypes.STRING,
      created_by: DataTypes.INTEGER,
      created_at: DataTypes.DATE,
      modified_by: DataTypes.INTEGER,
      modified_at: DataTypes.DATE
    }, { 
      timestamps: false,
      underscored: true
    });

exports.get=Lane;
exports.table=lanes_table;

Lane.prototype.save=function(onSuccess, onError) {
    lanes_table.build(this).save().success(onSuccess).error(onError);
};
