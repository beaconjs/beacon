var Story = require('../../models/card_wall/story').get;
var NotificationsService = require('../../notifications');

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

exports.forUser = function(req, res) {
  Story.forUser( req.params.userId, req.params.projectId, function(o){
        res.json(o);
    }, function(error) { 
        console.log(error); 
    });
}

exports.get = function(req, res){
  Story.get( req.params.id, function(o){
        res.json(o);
    }, function(error) { 
        console.log(error); 
    });
};

exports.forSprint = function(req, res){
  Story.forSprint( req.params.id, function(o){
        res.json(o);
    }, function(error) { 
        console.log(error); 
    });
};

exports.create = function(req, res){
    var s = req.body;
    var story = new Story(s.title, s.details, s.owner_id, s.points, req.params.id, s.sprint_id, s.created_by);
    story.save(function(){
        NotificationsService.send({ id: s.created_by }, req.params.id, " added story " + s.title, true);
        res.send("done");
    }, function(error){
        res.send(500, error);
    });
};

exports.update = function(req, res){
    var s = req.body;
    var story = new Story(s.title, s.details, s.owner_id, s.points, s.epic_id, s.sprint_id, s.created_by, s.status, s.created_at, s.modified_by);
    story.id = req.params.id;
    story.update(function(){
        NotificationsService.send({ id: s.modified_by }, req.params.id, " updated story " + s.title, true);
        res.send("done");
    }, function(error){
        res.send(500, error);
    });
};

exports.progress = function(req, res) {
    Story.progress(req.params.id, req.params.sprintId, function(o){
        res.json(o);
    }, function(error){
        res.send(500, error);
    });
}
