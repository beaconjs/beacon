var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable('todos', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        title: 'string',
        status: 'string',
        due_date: 'datetime',
        project_id: 'int',
        owner_id: 'int',
        created_at: 'datetime',
        modified_at: 'datetime',
        created_by: 'int',
        modified_by: 'int'
      }, callback);

    db.runSql("ALTER TABLE todos ADD CONSTRAINT `fk_todos_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)");
    db.runSql("ALTER TABLE todos ADD CONSTRAINT `fk_todos_user` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`)");
    db.runSql("ALTER TABLE todos ADD details LONGTEXT");
};

exports.down = function(db, callback) {
    db.dropTable('todos', callback);
};
