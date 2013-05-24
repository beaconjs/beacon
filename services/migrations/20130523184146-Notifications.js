var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable('notifications', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        text: 'string',
        project_id: 'int',
        created_at: 'datetime',
        created_by: 'int'
      }, callback);
    
    db.runSql("ALTER TABLE notifications ADD CONSTRAINT `fk_notifications_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)");
    db.runSql("ALTER TABLE notifications ADD CONSTRAINT `fk_notifications_user` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)");
};

exports.down = function(db, callback) {
    db.dropTable('notifications', callback);
};
