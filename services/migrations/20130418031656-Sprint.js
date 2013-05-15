var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable('sprints', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        title: 'string',
        project_id: 'int',
        start_date: 'datetime',
        end_date: 'datetime',
        created_at: 'datetime',
        modified_at: 'datetime',
        created_by: 'int',
        modified_by: 'int'
      }, callback);
    
    db.runSql("ALTER TABLE sprints ADD CONSTRAINT `fk_sprints_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)");
};

exports.down = function(db, callback) {
    db.dropTable('sprints', callback);
};
