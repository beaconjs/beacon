var Search = require('../models/search');

/*
 * lookup content.
 */

exports.lookup = function(req, res){
  Search.lookup(req.params.id, req.params.text, function(myTableRows) {
    res.json(myTableRows);
  }, function() {
    res.send(500, "Error!");
  });
};
