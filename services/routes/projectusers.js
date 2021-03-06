var ProjectUsers = require('../models/projectusers').get;
var NotificationsService = require('../notifications');

/*
 * GET project member listing.
 */

exports.list = function(req, res){
  ProjectUsers.list(req.params.id, function(o){
    o = o || [];
    res.json(o);
  }, function(err){
    res.send(err);
  });
};

exports.forUser = function(req, res){
  ProjectUsers.forUser(req.params.userId, function(o){
    o = o || [];
    res.json(o);
  }, function(err){
    res.send(err);
  });
};

exports.create = function(req, res){
    var p = req.body;
    if (!Array.isArray(p)) {
      p = [p];
    }
    p.forEach(function(e){
      var user = new ProjectUsers(req.params.id, e.user_id, e.role_id);
      user.save(function(){
        NotificationsService.send(e.issuer, req.params.id, " added user " + e.user.name + " to project " + e.project_name);
      }, function(){});
    });

    res.send({msg: "done"});
};