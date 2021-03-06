var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable('notes', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        title: 'string',
        project_id: 'int',
        created_at: 'datetime',
        modified_at: 'datetime',
        created_by: 'int',
        modified_by: 'int'
      }, callback);

    db.runSql("ALTER TABLE notes ADD CONSTRAINT `fk_notes_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)");
    db.runSql("ALTER TABLE notes ADD details LONGTEXT");
};

exports.down = function(db, callback) {
    db.dropTable('notes', callback);
};
