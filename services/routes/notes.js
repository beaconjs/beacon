var Note = require('../models/note').get;

/*
 * GET notes listing.
 */

exports.list = function(req, res){
  Note.all( function(docs){
        res.render('card_wall/stories.jade', { 
            title: 'Card Wall',
            stories:docs
        });
    }, function(error) { 
        console.log(error); 
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