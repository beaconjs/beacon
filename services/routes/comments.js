var Comment = require('../models/notes/comment').get;
var NotificationsService = require('../notifications');

/*
 * GET comments for a note.
 */

exports.forNote = function(req, res){
  Comment.forNote(req.params.id, function(o){
    res.json(o);
  }, function(err){
    res.send(err);
  });
};

exports.get = function(req, res){
  Comment.get(req.params.id, req.params.noteId, function(o){
    res.json(o);
  }, function(err){
    res.send(err);
  });
};

exports.createForNote = function(req, res){
    var o = req.body;
    var comment = new Comment(o.details, o.user.id, req.params.id, 'note');
    if (o.id) comment.id = o.id;
    
    comment.save(function(obj){
        NotificationsService.send(o.user, o.project_id, " added comment \"" + o.details + "\" to note \"" + o.note_title + "\".");
        res.json({id: obj.id});
    }, function(error){
        console.log(error);
        res.send(500, "error: " + error);
    });
};