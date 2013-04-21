var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.addColumn('epics', 'project_id', 'int', callback);
};

exports.down = function(db, callback) {
  db.removeColumn('epics', 'project_id', 'int', callback);
};
