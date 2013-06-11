var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable('bug_attachments', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        bug_id: 'int',
        filename: 'string',
        screenshot: 'text'
      }, callback);

    db.runSql("ALTER TABLE bug_attachments ADD CONSTRAINT `fk_bug_attachment_bug` FOREIGN KEY (`bug_id`) REFERENCES `bugs` (`id`)");
};

exports.down = function(db, callback) {
    db.dropTable('bug_attachments', callback);
};
