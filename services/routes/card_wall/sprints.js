var Sprint = require('../../models/card_wall/sprint').get;

/*
 * GET sprint listing.
 */

exports.list = function(req, res){
  Sprint.list( req.params.id, function(o){
        res.json(o);
    }, function(error) { 
        console.log(error); 
    });
};

exports.create = function(req, res){
    var e = req.body;
    var sprint = new Sprint(e.title, req.params.id, e.startDate, e.endDate, e.user_id);
    sprint.save(function(){
        res.send("done");
    }, function(error){
        res.send(500, error);
    });
};
