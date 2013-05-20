var Sprint = require('../../models/card_wall/sprint').get;
var NotificationsService = require('../../notifications');

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

exports.current = function(req, res){
  Sprint.current( req.params.id, function(o){
        res.json(o);
    }, function(error) { 
        console.log(error); 
    });
};

exports.create = function(req, res){
    var e = req.body;
    var sprint = new Sprint(e.title, req.params.id, e.startDate, e.endDate, e.user_id);
    sprint.save(function(){
        NotificationsService.send(e.issuer, req.params.id, " added sprint " + e.title + " to project " + e.project_name);
        res.send("done");
    }, function(error){
        res.send(500, error);
    });
};
