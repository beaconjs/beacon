var fs = require('fs');
var mkdirp = require('mkdirp');
var Note = require('../models/notes/note').get;

/*
 * GET notes listing.
 */

exports.list = function(req, res){
  Note.all(req.params.id, function(o){
    res.json(o);
  }, function(err){
    res.send(err);
  });
};

exports.get = function(req, res){
  Note.get(req.params.id, req.params.noteId, function(o){
    res.json(o);
  }, function(err){
    res.send(err);
  });
};

exports.create = function(req, res){
    var o = req.body;
    var note = new Note(o.title, o.details, o.project, o.user);
    if (o.id) note.id = o.id;
    
    note.save(function(obj){
        res.json({id: obj.id});
    }, function(error){
        console.log(error);
        res.send(500, "error: " + error);
    });
};

exports.upload = function(req, res) {
  var path = __dirname + '/../public/uploads/' + req.params.id;
  mkdirp(path, function (err) {
    if (err) console.error(err)
    else {
      fs.readFile(req.files.file.path, function (err, data) {
        path += ("/" + req.files.file.name);
        fs.writeFile(path, data, function (err) {
          console.log('done!');
        });
      });
    }
  });

  res.send('done');
}