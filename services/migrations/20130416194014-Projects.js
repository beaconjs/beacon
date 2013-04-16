var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable('projects', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        name: 'string',
        description: 'string'
      }, callback);
};

exports.down = function(db, callback) {
    db.dropTable('projects', callback);
};
