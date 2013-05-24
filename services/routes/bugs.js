var fs = require('fs');
var mkdirp = require('mkdirp');
var Bug = require('../models/bugs').get;
var NotificationsService = require('../notifications');

/*
 * GET bugs listing.
 */

exports.list = function(req, res){
  Bug.all(req.params.id, function(o){
    res.json(o);
  }, function(err){
    res.send(err);
  });
};

exports.get = function(req, res){
  Bug.get(req.params.id, req.params.bugId, function(o){
    res.json(o);
  }, function(err){
    res.send(err);
  });
};

exports.create = function(req, res){
    var o = req.body;
    var bug = new Bug(o.title, o.details, o.project, o.owner, o.status, o.priority, o.user);
    if (o.id) bug.id = o.id;
    
    bug.save(function(obj){
        if (!o.id) {
          NotificationsService.send({id: o.user}, o.project, " created bug \"" + o.title + "\".", true);
        } else if (o.notify) {
          NotificationsService.send({id: o.user}, o.project, " updated bug \"" + o.title + "\".", true);
        }
        res.json({id: obj.id});
    }, function(error){
        console.log(error);
        res.send(500, "error: " + error);
    });
};
