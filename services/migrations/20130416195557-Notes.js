var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable('notes', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        title: 'string',
        details: 'string',
        project_id: 'int',
        created_at: 'datetime',
        modified_at: 'datetime',
        created_by: 'int',
        modified_by: 'int'
      }, callback);
};

exports.down = function(db, callback) {
    db.dropTable('notes', callback);
};
