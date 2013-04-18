var Epic = require('./epic').table

var Project = function(name, description, epics, created_by) {
 this.name = name, 
 this.description = description, 
 this.epics = epics,
 this.created_by = created_by,
 this.modified_by = created_by,
 this.created_at = new Date(),
 this.modified_at = new Date();
};

var projects_table = function(sequelize, DataTypes) {
    sequelize.define('projects', {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      created_by: DataTypes.INTEGER,
      created_at: DataTypes.DATE,
      modified_by: DataTypes.INTEGER,
      modified_at: DataTypes.DATE;
    });
};

table.hasMany(Epic);

exports=Project;
exports.table=projects_table;
