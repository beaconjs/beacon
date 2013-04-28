var Project = require('../models/project').get;

/*
 * GET project listing.
 */

exports.list = function(req, res){
    console.log(1);
  Project.all(function(o){
    res.json(o);
  }, function(err){
    res.send(err);
  });
};

exports.create = function(req, res){
    var p = req.body;
    var project = new Project(p.name, p.description, null, 1);
    project.save(function(){}, function(){});

    res.send({msg: "done"});
};