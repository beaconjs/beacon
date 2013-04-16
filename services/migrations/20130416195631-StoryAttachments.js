var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable('story_attachments', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        story_id: 'int',
        filename: 'string'
      }, callback);
};

exports.down = function(db, callback) {
    db.dropTable('story_attachments', callback);
};
