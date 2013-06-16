var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable('chats', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        channel: 'string',
        created_at: 'datetime',
        author: 'string'
      }, callback);
    db.runSql("CREATE INDEX chat_channel_idx on chats(channel)");
    db.runSql("ALTER TABLE chats ADD `text` LONGTEXT");
};

exports.down = function(db, callback) {
    db.dropTable('chats', callback);
};
