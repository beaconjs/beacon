var User = require('../models/users').get;

/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.authenticate = function(req, res) {
  User.find(req.body.username, req.body.password, function(o) {
    res.json(o.selectedValues);
  }, function(error) {
    console.log(error);
    res.send("Auth failed");
  });
};