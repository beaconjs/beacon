var Lane = function(name, max_stories, status) {
 this.name = name, 
 this.max_stories = max_stories, 
 this.status = status,
 this.created_at = new Date(),
 this.modified_at = new Date();
};

var lanes_table = function(sequelize, DataTypes) {
    sequelize.define('lanes', {
      name: DataTypes.STRING,
      max_stories: DataTypes.INTEGER,
      status: DataTypes.STRING,
      created_by: DataTypes.INTEGER,
      created_at: DataTypes.DATE,
      modified_by: DataTypes.INTEGER,
      modified_at: DataTypes.DATE;
    });
};

exports=Lane;
exports.table=lanes_table;
