var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable('story_watchers', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        story_id: 'int',
        user_id: 'int'
      }, callback);
};

exports.down = function(db, callback) {
    db.dropTable('story_watchers', callback);
};
