var db = require("../../db.js").sequelize;
var DataTypes = require("sequelize");

var stories = require('./story').table

var Epic = function(title, details, status, stories) {
   this.title = title, 
   this.details = details, 
   this.status = status,
   this.stories = stories,
   this.created_at = new Date(),
   this.modified_at = new Date();
};

var epics_table = db.define('epics', {
    title: DataTypes.STRING,
    details: DataTypes.STRING,
    created_by: DataTypes.INTEGER,
    created_at: DataTypes.DATE,
    modified_by: DataTypes.INTEGER,
    modified_at: DataTypes.DATE
  }, { 
      timestamps: false,
      underscored: true
    });

epics_table.hasMany(stories);

exports.get=Epic;
exports.table=epics_table;

Epic.prototype.save=function(onSuccess, onError) {
    epics_table.build(this).save().success(onSuccess).error(onError);
};
