var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable('story_steps', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        story_id: 'int',
        title: 'string',
        status: 'string'
      }, callback);
};

exports.down = function(db, callback) {
    db.dropTable('story_steps', callback);
};
