var db = require("../../db.js").sequelize;
var DataTypes = require("sequelize");

var Sprint = function(title, project_id, startDate, endDate, created_by) {
 this.title = title, 
 this.project_id = project_id,
 this.start_date = startDate, 
 this.end_date = endDate,
 this.created_by = created_by,
 this.modified_by = created_by,
 this.created_at = new Date(),
 this.modified_at = new Date();
};

var sprints_table = db.define('sprints', {
      title: DataTypes.STRING,
      project_id: DataTypes.INTEGER,
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
      created_by: DataTypes.INTEGER,
      created_at: DataTypes.DATE,
      modified_by: DataTypes.INTEGER,
      modified_at: DataTypes.DATE
    }, { 
      timestamps: false,
      underscored: true
    });

exports.get=Sprint;
exports.table=sprints_table;

Sprint.prototype.save=function(onSuccess, onError) {
    sprints_table.build(this).save().success(onSuccess).error(onError);
};

Sprint.list=function(project_id, onSuccess, onError) {
    sprints_table.findAll( { where: { project_id: project_id } } ).success(onSuccess).error(onError);
};
