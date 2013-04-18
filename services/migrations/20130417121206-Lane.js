var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable('lanes', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        title: 'string',
        max_stories: 'int',
        status: 'string'
      }, callback);
};

exports.down = function(db, callback) {
    db.dropTable('lanes', callback);
};
