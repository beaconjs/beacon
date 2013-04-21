var db = require("../../db.js").sequelize;
var DataTypes = require("sequelize");

var Lane = function(title, max_stories, status) {
 this.title = title, 
 this.max_stories = max_stories, 
 this.status = status;
};

var lanes_table = db.define('lanes', {
      title: DataTypes.STRING,
      max_stories: DataTypes.INTEGER,
      status: DataTypes.STRING
    }, { 
      timestamps: false,
      underscored: true
    });

exports.get=Lane;
exports.table=lanes_table;

Lane.prototype.save=function(onSuccess, onError) {
    lanes_table.build(this).save().success(onSuccess).error(onError);
};
