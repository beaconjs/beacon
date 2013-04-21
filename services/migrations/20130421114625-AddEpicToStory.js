var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.addColumn('stories', 'epic_id', 'int', callback);
};

exports.down = function(db, callback) {
  db.removeColumn('stories', 'epic_id', 'int', callback);
};
