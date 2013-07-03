
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , roles = require('./routes/roles')
  , projects = require('./routes/projects')
  , notes = require('./routes/notes')
  , bugs = require('./routes/bugs')
  , search = require('./routes/search')
  , resources = require('./routes/resources')
  , todos = require('./routes/todos')
  , comments = require('./routes/comments')
  , annotations = require('./routes/annotations')
  , projectusers = require('./routes/projectusers')
  , cardModels = require('./routes/card_wall')
  , notifications = require('./routes/notifications')
  , http = require('http')
  , db = require("./db")
  , path = require('path');

require('./chat_server');
require('./notifications');

var app = express();

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", 'Origin, X-Requested-With, X-File-Name, Content-Type, Cache-Control, Accept, timeout, Content-Length, Accept-Encoding, Accept-Charset');

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
app.post('/users', user.create);
app.get('/users/search/:name', user.lookup);
app.get('/roles', roles.list);
app.post('/projects', projects.create);
app.post('/resource', resources.get);
app.get('/projects', projects.list);
app.get('/projects/:id', projects.get);
app.get('/projects/:id/search/:text', search.lookup);
app.get('/projects/:id/notifications', notifications.list);
app.get('/projects/:id/notes', notes.list);
app.get('/projects/:id/notes/:noteId', notes.get);
app.post('/projects/:id/:bugId/bugUpload', bugs.upload);
app.post('/projects/:id/:noteId/upload', notes.upload);
app.post('/projects/:id/upload', projects.upload);
app.post('/projects/:id/:noteId/annotations', annotations.create);
app.post('/projects/:id/:noteId/annotations/list', annotations.list);

app.get('/projects/:id/bugs', bugs.list);
app.get('/projects/:id/bugs/:bugId', bugs.get);
app.get('/projects/:id/todos', todos.list);
app.get('/projects/:id/todos/:todoId', todos.get);
app.post('/projects/:id/bugs', bugs.create);
app.post('/projects/:id/todos', todos.create);
app.post('/projects/:id/bugs/:bugId/screenshot', bugs.addScreenshot);
app.get('/bugs/:id/attachments', bugs.attachments);

app.get('/projects/:id/members', projectusers.list);
app.post('/projects/:id/members', projectusers.create);
app.get('/users/:userId/projects', projectusers.forUser);
app.post('/notes', notes.create);
app.post('/notes/:id/comments', comments.createForNote);
app.get('/notes/:id/comments', comments.forNote);
app.get('/notes/:id/attachments', notes.attachments);
app.get('/comments', comments.get);
app.post('/bugs/:id/comments', comments.createForBug);
app.post('/todos/:id/comments', comments.createForTodo);
app.get('/bugs/:id/comments', comments.forBug);
app.get('/todos/:id/comments', comments.forTodo);


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
app.get('/users/:userId/projects/:projectId/stories', cardModels.stories.forUser);
app.get('/projects/:id/:sprintId/progress', cardModels.stories.progress);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
