var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable('note_watchers', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        note_id: 'int',
        user_id: 'int'
      }, callback);
};

exports.down = function(db, callback) {
    db.dropTable('note_watchers', callback);
};
