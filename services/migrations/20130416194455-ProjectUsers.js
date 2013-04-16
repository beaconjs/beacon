var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable('project_users', {
        project_id: { type: 'int', primaryKey: true },
        user_id: { type: 'int', primaryKey: true },
        role_id: 'int'
      }, callback);
};

exports.down = function(db, callback) {
    db.dropTable('project_users', callback);
};
