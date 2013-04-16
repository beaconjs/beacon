var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable('history_logs', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        user_id: 'int',
        details: 'string',
        source_type: 'string',
        source_id: 'int',
        created_at: 'datetime'
      }, callback);
};

exports.down = function(db, callback) {
    db.dropTable('history_logs', callback);
};
