var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable('bugs', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        title: 'string',
        details: 'string',
        status: 'string',
        project_id: 'int',
        owner_id: 'int',
        created_at: 'datetime',
        modified_at: 'datetime',
        created_by: 'int',
        modified_by: 'int'
      }, callback);

    db.runSql("ALTER TABLE bugs ADD CONSTRAINT `fk_bugs_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)");
    db.runSql("ALTER TABLE bugs ADD CONSTRAINT `fk_bugs_user` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`)");
};

exports.down = function(db, callback) {
    db.dropTable('bugs', callback);
};
