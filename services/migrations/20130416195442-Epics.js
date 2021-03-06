var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable('epics', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        title: 'string',
        created_at: 'datetime',
        modified_at: 'datetime',
        created_by: 'int',
        modified_by: 'int'
      }, callback);
    db.runSql("ALTER TABLE epics ADD details LONGTEXT");
};

exports.down = function(db, callback) {
    db.dropTable('epics', callback);
};
