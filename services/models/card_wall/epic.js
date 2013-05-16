var db = require("../../db.js").sequelize;
var DataTypes = require("sequelize");

var Project = require('../project').table

var Epic = function(title, details, project_id, status) {
   this.title = title, 
   this.details = details, 
   this.project_id = project_id,
   this.status = status,
   this.created_at = new Date(),
   this.modified_at = new Date();
};

var epics_table = db.define('epics', {
    title: DataTypes.STRING,
    details: DataTypes.STRING,
    project_id: DataTypes.INTEGER,
    created_by: DataTypes.INTEGER,
    created_at: DataTypes.DATE,
    modified_by: DataTypes.INTEGER,
    modified_at: DataTypes.DATE
  }, { 
      timestamps: false,
      underscored: true
    });

epics_table.belongsTo(Project);
Project.hasMany(epics_table);

exports.get=Epic;
exports.table=epics_table;

Epic.prototype.save=function(onSuccess, onError) {
    epics_table.build(this).save().success(onSuccess).error(onError);
};

Epic.all = function(project_id, onSuccess, onError) {
    db.query("select count(s.id) as num_of_stories, sum(s.points) as points, s.epic_id, " + 
      "e.* from epics e left outer join stories s on s.epic_id=e.id where e.project_id=" + project_id + " group by e.id").success(onSuccess).error(onError);
}
