var Lane = require('../../models/card_wall/lane').get;
var NotificationsService = require('../../notifications');

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
    var lane = new Lane(e.title, req.params.id, e.position, e.max_stories, e.status, e.end_state);
    lane.save(function(){
        NotificationsService.send(e.issuer, req.params.id, " added lane " + e.title + " to project " + e.project_name);
        res.send("done");
    }, function(error){
        res.send(500, error);
    });
};
