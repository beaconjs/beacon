var Story = require('./story').table

var Epic = function(name, details, status, stories) {
 this.name = name, 
 this.details = details, 
 this.status = status,
 this.stories = stories,
 this.created_at = new Date(),
 this.modified_at = new Date();
};

var epics_table = function(sequelize, DataTypes) {
    sequelize.define('epics', {
      name: DataTypes.STRING,
      details: DataTypes.STRING,
      created_by: DataTypes.INTEGER,
      created_at: DataTypes.DATE,
      modified_by: DataTypes.INTEGER,
      modified_at: DataTypes.DATE;
    });
};

table.hasMany(Story);

exports=Epic;
exports.table=epics_table;
