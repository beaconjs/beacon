var Notification = require('../models/history/notifications').get;

exports.list = function(req, res) {
  Notification.all(req.params.id, function(o){
    res.json(o);
  }, function(err){
    res.send(err);
  });
};
