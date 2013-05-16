var Epic = require('../../models/card_wall/epic').get;

/*
 * GET epic listing.
 */

exports.list = function(req, res){
  Epic.all( req.params.id, function(o){
        res.json(o);
    }, function(error) { 
        console.log(error); 
    });
};

exports.create = function(req, res){
    var e = req.body;
    var epic = new Epic(e.title, e.details, req.params.id, e.status);
    epic.save(function(){
        res.send("done");
    }, function(error){
        res.send(500, error);
    });
};
