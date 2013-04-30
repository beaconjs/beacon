var Note = require('../models/note').get;

/*
 * GET notes listing.
 */

exports.list = function(req, res){
  Note.all(req.params.id, function(o){
    res.json(o);
  }, function(err){
    res.send(err);
  });
};

exports.create = function(req, res){
    var o = req.body;
    var note = new Note(o.title, o.details, o.project, o.user);
    if (o.id) note.id = o.id;
    
    note.save(function(obj){
        res.json({id: obj.id});
    }, function(error){
        console.log(error);
        res.send(500, "error: " + error);
    });
};