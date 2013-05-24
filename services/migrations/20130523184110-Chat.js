var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable('chats', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        text: 'string',
        channel: 'string',
        created_at: 'datetime',
        author: 'string'
      }, callback);
    db.runSql("CREATE INDEX chat_channel_idx on chats(channel)");
};

exports.down = function(db, callback) {
    db.dropTable('chats', callback);
};
