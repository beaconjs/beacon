var fs = require('fs');

exports.get = function(req, res){
  var r = req.body;
  var path = __dirname + '/../public/uploads/' + r.project_id + '/' + r.dirname + '/' + r.filename;

  fs.readFile(path, function(err, data) {
    base64data = new Buffer(data).toString('base64');
    res.send(base64data);
  });
};
