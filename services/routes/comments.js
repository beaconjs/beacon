var Comment = require('../models/notes/comment').get;
var NotificationsService = require('../notifications');

/*
 * GET comments for a note.
 */

var getComments = function(req, res, source_type) {
  Comment.list(req.params.id, source_type, function(o){
    res.json(o);
  }, function(err){
    res.send(err);
  });
}

exports.forNote = function(req, res){
  getComments(req, res, 'note');
};

exports.forBug = function(req, res){
  getComments(req, res, 'bug');
};

exports.forTodo = function(req, res){
  getComments(req, res, 'todo');
};

exports.get = function(req, res){
  Comment.get(req.params.id, req.params.noteId, function(o){
    res.json(o);
  }, function(err){
    res.send(err);
  });
};

var createComment = function(req, res, source_type) {
    var o = req.body;
    var comment = new Comment(o.details, o.user.id, req.params.id, source_type);
    if (o.id) comment.id = o.id;
    
    comment.save(function(obj){
        NotificationsService.send(o.user, o.project_id, " added comment \"" + o.details + "\" to " + source_type + " \"" + o.note_title + "\".");
        res.json({id: obj.id});
    }, function(error){
        console.log(error);
        res.send(500, "error: " + error);
    });
}

exports.createForNote = function(req, res){
    createComment(req, res, 'note');
};

exports.createForBug = function(req, res){
    createComment(req, res, 'bug');
};

exports.createForTodo = function(req, res){
    createComment(req, res, 'todo');
};
