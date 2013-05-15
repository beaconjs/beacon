var Story = require('../../models/card_wall/story').get;

/*
 * GET story listing.
 */

exports.list = function(req, res){
  Story.list( req.params.id, function(o){
        res.json(o);
    }, function(error) { 
        console.log(error); 
    });
};

exports.forEpic = function(req, res){
  Story.forEpic( req.params.id, function(o){
        res.json(o);
    }, function(error) { 
        console.log(error); 
    });
};

exports.create = function(req, res){
    var s = req.body;
    var story = new Story(s.title, s.details, s.owner_id, s.points, req.params.id, s.sprint_id);
    story.save(function(){
        res.send("done");
    }, function(error){
        res.send(500, error);
    });
};