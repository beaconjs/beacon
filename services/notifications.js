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
 * HTTP server
 */
var server = http.createServer(function(request, response) {
    // Not important for us. We're writing WebSocket server, not HTTP server
});
server.listen(webSocketsServerPort, function() {
    console.log((new Date()) + " Server is listening on port " + webSocketsServerPort);
});

/**
 * WebSocket server
 */
var wsServer = new webSocketServer({
    // WebSocket server is tied to a HTTP server. WebSocket request is just
    // an enhanced HTTP request. For more info http://tools.ietf.org/html/rfc6455#page-6
    httpServer: server
});

var clients = [];

// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', function(request) {
    console.log((new Date()) + ' Connection from origin ' + request.origin + ' for notifications.');

    // accept connection - you should check 'request.origin' to make sure that
    // client is connecting from your website
    // (http://en.wikipedia.org/wiki/Same_origin_policy)
    var connection = request.accept(null, request.origin); 
    // we need to know client index to remove them on 'close' event
    var index = clients.push(connection) - 1;

    console.log((new Date()) + ' Connection accepted.');

    // user disconnected
    connection.on('close', function(connection) {
            console.log((new Date()) + " Peer "
                + "(" + connection.remoteAddress + ") disconnected from notifications service.");
            clients.splice(index, 1);
    });
});

exports.send = function(issuer, project_id, message) {
    for (var i=0; i < clients.length; i++) {
        console.log(message);

        clients[i].sendUTF(JSON.stringify( { message: message, issuer: issuer, project_id: project_id }));
    }
}
