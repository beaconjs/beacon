var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable('comments', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        user_id: 'int',
        title: 'string',
        source_type: 'string',
        source_id: 'int',
        created_at: 'datetime'
      }, callback);
    db.runSql("ALTER TABLE comments ADD details LONGTEXT");
};

exports.down = function(db, callback) {
    db.dropTable('comments', callback);
};
