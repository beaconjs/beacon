var Role = require('../models/roles').get;

/*
 * GET users listing.
 */

exports.list = function(req, res){
  Role.list(function(o){
    res.json(o);
  }, function(err){
    res.send(err);
  });
};
