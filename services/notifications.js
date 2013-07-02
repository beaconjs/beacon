// http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
"use strict";

var Notification = require('./models/history/notifications').get;

// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'beacon-notifications';

// Port where we'll run the websocket server
var webSocketsServerPort = 3338;

var io = require('socket.io').listen(webSocketsServerPort);
console.log((new Date()) + " Notifications Server is listening on port " + webSocketsServerPort);

/**
 * Global variables
 */
 var Channel = function(name) {
    this.name = name,
    // list of currently connected clients (users)
    this.clients = [ ];
 }

var channels = {}; // hash map of channels (name -> obj)

// This callback function is called every time someone
// tries to connect to the WebSocket server
io.sockets.on('connection', function (socket) {
    var channel = null; 

    socket.on('channel', function(message) {
        channel = message; 
        console.log((new Date()) + ' Request received on channel ' + channel + ' for notifications.');

        if (!channels[channel]) channels[channel] = new Channel(channel);
        // we need to know client index to remove them on 'close' event
        var index = channels[channel].clients.push(socket) - 1;
        console.log((new Date()) + ' Connection accepted.');
    });

    // user disconnected
    socket.on('disconnect', function(connection) {
        console.log((new Date()) + " Peer disconnected from notifications service.");
        channels[channel].clients.splice(index, 1);
    });
});

exports.send = function(issuer, project_id, message, suppress) {
    var channel = 'project_' + project_id;
    if (!channels[channel]) return;

    new Notification(message, project_id, issuer.id).save(function(){}, function(){});
    var mType = "text";

    if (suppress) {
        message = null;
        mType = "refresh";
    }

    for (var i=0; i < channels[channel].clients.length; i++) {
        channels[channel].clients[i].emit('message', JSON.stringify( { type: mType, message: message, issuer: issuer, project_id: project_id }));
    }
}
