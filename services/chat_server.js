// http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
"use strict";

var Chat = require('./models/history/chat').get;

// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'beacon-chat';

// Port where we'll run the websocket server
var webSocketsServerPort = 1337;

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
 * Helper function for escaping input strings
 */
function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * HTTP server
 */
var server = http.createServer(function(request, response) {
    // Not important for us. We're writing WebSocket server, not HTTP server
});
server.listen(webSocketsServerPort, function() {
    console.log((new Date()) + " Chat Server is listening on port " + webSocketsServerPort);
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
    var channel = request.requestedProtocols[0]; // no direct way of adding a header :-(
    console.log((new Date()) + ' Connection from origin ' + request.origin + ' for channel ' + channel + '.');

    if (!channels[channel]) channels[channel] = new Channel(channel);

    var history = channels[channel].history;

    // accept connection - you should check 'request.origin' to make sure that
    // client is connecting from your website
    // (http://en.wikipedia.org/wiki/Same_origin_policy)
    var connection = request.accept(null, request.origin); 
    // we need to know client index to remove them on 'close' event
    var index = channels[channel].clients.push(connection) - 1;
    var userName = false;

    console.log((new Date()) + ' Connection accepted.');

    if (history.length == 0) {
        Chat.all(channel, 0, 100, function(o) {
            for(var i =0; i< o.length; i++) {
                var obj = {
                    time: o[i].created_at,
                    text: o[i].text,
                    author: o[i].author,
                    channel: o[i].channel
                };
                history.push(obj);
            }

            if (history.length > 0) {
                history.reverse();
                connection.sendUTF(JSON.stringify( { type: 'history', data: history} ));
            }
        }, function(){} );
    }

    // send back chat history
    if (history.length > 0) {
        connection.sendUTF(JSON.stringify( { type: 'history', data: history} ));
    }

    // user sent some message
    connection.on('message', function(message) {
        if (message.type === 'utf8') { // accept only text
            if (userName === false) { // first message sent by user is their name
                // remember user name
                userName = htmlEntities(message.utf8Data);
                console.log((new Date()) + ' User is known as: ' + userName);

            } else { // log and broadcast the message
                //console.log((new Date()) + ' Received Message from '
                //            + userName + ': ' + message.utf8Data);
                
                // we want to keep history of all sent messages
                var obj = {
                    time: (new Date()).getTime(),
                    text: message.utf8Data,
                    author: userName,
                    channel: channel
                };
                history.push(obj);
                
                new Chat(message.utf8Data, channel, userName).save(function(){}, function(){});

                channels[channel].history = history.slice(-100);

                // broadcast message to all connected clients
                var json = JSON.stringify({ type:'message', data: obj });
                for (var i=0; i < channels[channel].clients.length; i++) {
                    channels[channel].clients[i].sendUTF(json);
                }
            }
        }
    });

    // user disconnected
    connection.on('close', function(connection) {
        if (userName !== false) {
            console.log((new Date()) + " Peer "
                + userName + "(" + connection.remoteAddress + ") disconnected.");
            // remove user from the list of connected clients
            channels[channel].clients.splice(index, 1);
        }
    });

});