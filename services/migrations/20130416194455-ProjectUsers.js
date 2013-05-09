var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable('project_users', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        project_id: 'int',
        user_id: 'int',
        role_id: 'int'
      }, callback);

    db.runSql("ALTER TABLE project_users ADD CONSTRAINT `fk_pusers_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)");
    db.runSql("ALTER TABLE project_users ADD CONSTRAINT `fk_pusers_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)");
    db.runSql("ALTER TABLE project_users ADD CONSTRAINT `fk_pusers_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)");
};

exports.down = function(db, callback) {
    db.dropTable('project_users', callback);
};
