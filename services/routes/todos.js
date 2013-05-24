var fs = require('fs');
var mkdirp = require('mkdirp');
var Todo = require('../models/todos').get;
var NotificationsService = require('../notifications');

/*
 * GET todos listing.
 */

exports.list = function(req, res){
  Todo.all(req.params.id, function(o){
    res.json(o);
  }, function(err){
    res.send(err);
  });
};

exports.get = function(req, res){
  Todo.get(req.params.id, req.params.todoId, function(o){
    res.json(o);
  }, function(err){
    res.send(err);
  });
};

exports.create = function(req, res){
    var o = req.body;
    var todo = new Todo(o.title, o.details, o.project, o.owner, o.status, o.due_date, o.user);
    if (o.id) todo.id = o.id;
    
    todo.save(function(obj){
        if (!o.id) {
          NotificationsService.send({id: o.user}, o.project, " created todo \"" + o.title + "\".", true);
        } else if (o.notify) {
          NotificationsService.send({id: o.user}, o.project, " updated todo \"" + o.title + "\".", true);
        }
        res.json({id: obj.id});
    }, function(error){
        console.log(error);
        res.send(500, "error: " + error);
    });
};
