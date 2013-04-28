var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable('project_users', {
        id: { type: 'int', primaryKey: true },
        project_id: 'int',
        user_id: 'int',
        role_id: 'int'
      }, callback);
};

exports.down = function(db, callback) {
    db.dropTable('project_users', callback);
};
