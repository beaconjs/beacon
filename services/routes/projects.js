var fs = require('fs');
var mkdirp = require('mkdirp');
var Project = require('../models/project').get;
var ProjectUsers = require('../models/projectusers').get;
var Role = require('../models/roles').get;
var Lane = require('../models/card_wall/lane').get;

/*
 * GET project listing.
 */

exports.list = function(req, res){
  Project.all(function(o){
    res.json(o);
  }, function(err){
    res.send(500, err);
  });
};

exports.get = function(req, res){
  Project.get(req.params.id, function(o){
    res.json(o);
  }, function(err){
    res.send(500, err);
  });
};

exports.create = function(req, res){
    var p = req.body;
    var project = new Project(p.name, p.description, null, p.created_by);
    project.save(function(o){
      Role.findByName('Owner', function(r) {
        var user = new ProjectUsers(o.id, p.created_by, r.id);
        user.save(function(){}, function(){});
      }, function(){});

      var lane = new Lane('Not Started', 1, o.id, 1000, 'not_started', false);
      lane.save(function(){}, function(){});
      res.json({msg: "done", project: o});
    }, function(err){
      res.send(500, err);
    });
};

exports.upload = function(req, res) {
  var path = __dirname + '/../public/uploads/' + req.params.id + '/chat';
  mkdirp(path, function (err) {
    if (err) {
      res.send(500, err);
    } else {
      fs.readFile(req.files.file.path, function (err, data) {
        path += ("/" + req.files.file.name);
        fs.writeFile(path, data, function (err) {
          res.send("done");
        });
      });
    }
  });
}
