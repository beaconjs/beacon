var Lane = require('../../models/card_wall/lane').get;

/*
 * GET lanes listing.
 */

exports.list = function(req, res){
  Lane.list( req.params.id, function(o){
        res.json(o);
    }, function(error) { 
        console.log(error); 
    });
};

exports.create = function(req, res){
    var e = req.body;
    e.status = e.status || e.title.toLowerCase().replace(/ /g, "_");
    var lane = new Lane(e.title, req.params.id, e.max_stories, e.status);
    lane.save(function(){
        res.send("done");
    }, function(error){
        res.send(500, error);
    });
};
