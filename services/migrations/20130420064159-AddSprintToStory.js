var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.addColumn('stories', 'sprint_id', 'int', callback);
};

exports.down = function(db, callback) {
  db.removeColumn('stories', 'sprint_id', 'int', callback);
};
