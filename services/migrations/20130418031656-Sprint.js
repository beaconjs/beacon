var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable('sprints', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        title: 'string',
        startDate: 'datetime',
        endDate: 'datetime',
        created_at: 'datetime',
        modified_at: 'datetime',
        created_by: 'int',
        modified_by: 'int'
      }, callback);
};

exports.down = function(db, callback) {
    db.dropTable('sprints', callback);
};
