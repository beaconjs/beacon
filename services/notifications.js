// http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
"use strict";

// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'beacon-notifications';

// Port where we'll run the websocket server
var webSocketsServerPort = 1338;

// websocket and http servers
var webSocketServer = require('websocket').server;
var http = require('http');

/**
 * Global variables
 */
 var Channel = function(name) {
    this.name = name,
    // latest 100 messages
    this.history = [ ],
    // list of currently connected clients (users)
    this.clients = [ ];
 }

var channels = {}; // hash map of channels (name -> obj)

/**
 * HTTP server
 */
var server = http.createServer(function(request, response) {
    // Not important for us. We're writing WebSocket server, not HTTP server
});
server.listen(webSocketsServerPort, function() {
    console.log((new Date()) + " Notifications Server is listening on port " + webSocketsServerPort);
});

/**
 * WebSocket server
 */
var wsServer = new webSocketServer({
    // WebSocket server is tied to a HTTP server. WebSocket request is just
    // an enhanced HTTP request. For more info http://tools.ietf.org/html/rfc6455#page-6
    httpServer: server
});

// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', function(request) {
    var channel = request.requestedProtocols[0];
    console.log((new Date()) + ' Connection from origin ' + request.origin + ' for channel ' + channel + ' for notifications.');

    if (!channels[channel]) channels[channel] = new Channel(channel);

    // accept connection - you should check 'request.origin' to make sure that
    // client is connecting from your website
    // (http://en.wikipedia.org/wiki/Same_origin_policy)
    var connection = request.accept(null, request.origin); 
    // we need to know client index to remove them on 'close' event
    var index = channels[channel].clients.push(connection) - 1;

    console.log((new Date()) + ' Connection accepted.');

    // user disconnected
    connection.on('close', function(connection) {
            console.log((new Date()) + " Peer "
                + "(" + connection.remoteAddress + ") disconnected from notifications service.");
            channels[channel].clients.splice(index, 1);
    });
});

exports.send = function(issuer, project_id, message) {
    var channel = 'project_' + project_id;
    if (!channels[channel]) return;

    for (var i=0; i < channels[channel].clients.length; i++) {
        console.log(message);

        channels[channel].clients[i].sendUTF(JSON.stringify( { message: message, issuer: issuer, project_id: project_id }));
    }
}
