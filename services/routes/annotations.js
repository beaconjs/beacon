var Annotation = require('../models/notes/annotation').get;
var Todo = require('../models/todos').get;

/*
 * GET annotations for a note.
 */

exports.list = function(req, res){
  Annotation.list(req.params.noteId, req.body.filename, function(o){
    res.json(o);
  }, function(err){
    res.send(err);
  });
};

exports.create = function(req, res){
    var o = req.body;
    var todo = new Todo(o.text, o.text, req.params.id, o.user_id, 'Pending', new Date(), o.user_id);
    todo.save(function(t){
      var annotation = new Annotation(o.x, o.y, o.user_id, req.params.noteId, t.id, o.filename);
      
      annotation.save(function(obj){
          res.json({id: obj.id});
      }, function(error){
          console.log(error);
          res.send(500, "error: " + error);
      });
    }, function(error){
      res.send(500, "error: " + error);
    });
};