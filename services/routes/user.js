var User = require('../models/users').get;

exports.authenticate = function(req, res) {
  User.find(req.body.username, req.body.password, function(o) {
    res.json(o.selectedValues);
  }, function(error) {
    console.log(error);
    res.send("Auth failed");
  });
};

exports.lookup = function(req, res){
  User.lookup(req.params.name, function(o){
    res.json(o);
  }, function(err){
    res.send(err);
  });
};
