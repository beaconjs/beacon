var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable('lanes', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        title: 'string',
        project_id: 'int',
        max_stories: 'int',
        status: 'string'
      }, callback);
    
    db.runSql("ALTER TABLE lanes ADD CONSTRAINT `fk_lanes_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)");
};

exports.down = function(db, callback) {
    db.dropTable('lanes', callback);
};
