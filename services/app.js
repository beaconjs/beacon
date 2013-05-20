
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , roles = require('./routes/roles')
  , projects = require('./routes/projects')
  , notes = require('./routes/notes')
  , comments = require('./routes/comments')
  , projectusers = require('./routes/projectusers')
  , cardModels = require('./routes/card_wall')
  , http = require('http')
  , db = require("./db")
  , path = require('path');

require('./chat_server');
require('./notifications');

var app = express();

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", 'Origin, X-Requested-With, Content-Type, Accept, timeout, Content-Length, Accept-Encoding, Accept-Charset');

    next();
}


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(allowCrossDomain);
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500, 'Something broke!');
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// handle OPTIONS requests from the browser
app.options("*", function(req,res,next){res.send(200);});

app.get('/', routes.index);
app.post('/authenticate', user.authenticate);
app.get('/users/search/:name', user.lookup);
app.get('/roles', roles.list);
app.post('/projects', projects.create);
app.get('/projects', projects.list);
app.get('/projects/:id', projects.get);
app.get('/projects/:id/notes', notes.list);
app.get('/projects/:id/notes/:noteId', notes.get);
app.post('/projects/:id/:noteId/upload', notes.upload);
app.post('/projects/:id/upload', projects.upload);

app.get('/projects/:id/members', projectusers.list);
app.post('/projects/:id/members', projectusers.create);
app.get('/users/:userId/projects', projectusers.forUser);
app.post('/notes', notes.create);
app.post('/notes/:id/comments', comments.createForNote);
app.get('/notes/:id/comments', comments.forNote);
app.get('/notes/:id/attachments', notes.attachments);
app.get('/comments', comments.get);

app.get('/projects/:id/sprints', cardModels.sprints.list);
app.get('/projects/:id/sprints/current', cardModels.sprints.current);
app.get('/projects/:id/lanes', cardModels.lanes.list);
app.get('/projects/:id/epics', cardModels.epics.list);
app.get('/projects/:id/stories', cardModels.stories.list);
app.get('/epics/:id/stories', cardModels.stories.forEpic);
app.get('/sprints/:id/stories', cardModels.stories.forSprint);
app.get('/stories/:id', cardModels.stories.get);
app.post('/projects/:id/epics', cardModels.epics.create);
app.post('/projects/:id/sprints', cardModels.sprints.create);
app.post('/projects/:id/lanes', cardModels.lanes.create);
app.post('/epics/:id/stories', cardModels.stories.create);
app.post('/stories/:id', cardModels.stories.update);

app.get('/projects/:id/progress', cardModels.stories.progress);
app.get('/projects/:id/:sprintId/progress', cardModels.stories.progress);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
