var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable('annotations', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        posx: 'int',
        posy: 'int',
        user_id: 'int',
        note_id: 'int',
        todo_id: 'int',
        filename: 'string',
        created_at: 'datetime'
      }, callback);

    db.runSql("ALTER TABLE annotations ADD CONSTRAINT `fk_annotations_note` FOREIGN KEY (`note_id`) REFERENCES `notes` (`id`)");
    db.runSql("ALTER TABLE annotations ADD CONSTRAINT `fk_annotations_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)");
    db.runSql("ALTER TABLE annotations ADD CONSTRAINT `fk_annotations_todo` FOREIGN KEY (`todo_id`) REFERENCES `todos` (`id`)");
};

exports.down = function(db, callback) {
    db.dropTable('annotations', callback);
};
