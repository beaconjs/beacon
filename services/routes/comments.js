var Comment = require('../models/notes/comment').get;

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
    var comment = new Comment(o.details, o.user, req.params.id, 'note');
    if (o.id) comment.id = o.id;
    
    comment.save(function(obj){
        res.json({id: obj.id});
    }, function(error){
        console.log(error);
        res.send(500, "error: " + error);
    });
};