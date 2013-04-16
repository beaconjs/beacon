var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable('tasks', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        story_id: 'int',
        title: 'string',
        status: 'string',
        created_at: 'datetime',
        modified_at: 'datetime',
        created_by: 'int',
        modified_by: 'int'
      }, callback);
};

exports.down = function(db, callback) {
    db.dropTable('tasks', callback);
};
