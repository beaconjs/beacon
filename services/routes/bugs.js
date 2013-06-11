var fs = require('fs');
var mkdirp = require('mkdirp');
var Bug = require('../models/bugs').get;
var BugAttachment = require('../models/bug_attachments').get;
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

exports.attachments = function(req, res){
  BugAttachment.forBug(req.params.id, function(o){
    res.json(o);
  }, function(err){
    res.send(err);
  });
};

exports.create = function(req, res){
    var o = req.body;
    var bug = new Bug(o.title, o.details, req.params.id, o.owner_id, o.status, o.priority, o.user);
    if (o.id) bug.id = o.id;
    
    bug.save(function(obj){
        if (!o.id) {
          NotificationsService.send({id: o.user}, req.params.id, " created bug \"" + o.title + "\".", true);
        } else if (o.notify) {
          NotificationsService.send({id: o.user}, req.params.id, " updated bug \"" + o.title + "\".", true);
        }
        res.json({id: obj.id});
    }, function(error){
        console.log(error);
        res.send(500, "error: " + error);
    });
};

exports.upload = function(req, res) {
  var path = __dirname + '/../public/uploads/' + req.params.id + '/bug-' + req.params.bugId;
  mkdirp(path, function (err) {
    if (err) console.error(err)
    else {
      fs.readFile(req.files.file.path, function (err, data) {
        path += ("/" + req.files.file.name);
        fs.writeFile(path, data, function (err) {
          BugAttachment.find(req.params.bugId, req.files.file.name, function(o) {
            if (!o) {
              // dont create an entry if it exists
              var attachment = new BugAttachment(req.params.bugId, req.files.file.name);
              attachment.save(function(){
                // done
              }, function(){});            
            }
          }, function() { });
        });
      });
    }
  });

  res.send('done');
}

exports.addScreenshot = function(req, res) {
  var o = req.body;
  var filename = req.files ? req.files.file.name : null;
  var bug = new BugAttachment(req.params.bugId, filename, o.screenshot);
  
  bug.save(function(obj){
      res.json({id: obj.id});
  }, function(error){
      console.log(error);
      res.send(500, "error: " + error);
  });
}
