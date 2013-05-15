var db = require("../../db.js").sequelize;
var DataTypes = require("sequelize");

var Lane = function(title, project_id, max_stories, status) {
 this.title = title, 
 this.project_id = project_id,
 this.max_stories = max_stories, 
 this.status = status;
};

var lanes_table = db.define('lanes', {
      title: DataTypes.STRING,
      project_id: DataTypes.INTEGER,
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

Lane.list=function(project_id, onSuccess, onError) {
    lanes_table.findAll( { where: { project_id: project_id } } ).success(onSuccess).error(onError);
};

Lane.getDefaultLane=function(project_id, onSuccess, onError) {
  lanes_table.find({ where: { status: 'not_started', project_id: project_id } }).success(onSuccess).error(onError);
}
