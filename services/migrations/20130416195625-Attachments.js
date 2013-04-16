var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable('note_attachments', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        note_id: 'int',
        filename: 'string'
      }, callback);
};

exports.down = function(db, callback) {
    db.dropTable('note_attachments', callback);
};
