// http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
"use strict";

var Chat = require('./models/history/chat').get;

// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'beacon-chat';

// Port where we'll run the websocket server
var webSocketsServerPort = 3337;

var io = require('socket.io').listen(webSocketsServerPort);
console.log((new Date()) + " Chat Server is listening on port " + webSocketsServerPort);

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

io.sockets.on('connection', function (socket) {
    /*socket.emit('message', { message: 'welcome to the chat' });
    socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });*/
    var userName = false;
    var channel = null; 
    var history = [];

    socket.on('channel', function(message) {
        channel = message; 
        console.log((new Date()) + ' Request received for channel ' + channel + '.');

        if (!channels[channel]) channels[channel] = new Channel(channel);

        history = channels[channel].history;

        // accept connection - you should check 'request.origin' to make sure that
        // client is connecting from your website
        // (http://en.wikipedia.org/wiki/Same_origin_policy)
        // we need to know client index to remove them on 'close' event
        var index = channels[channel].clients.push(socket) - 1;

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
                    socket.emit('message', JSON.stringify( { type: 'history', data: history} ));
                }
            }, function(){} );
        }

        // send back chat history
        if (history.length > 0) {
            socket.emit('message', JSON.stringify( { type: 'history', data: history} ));
        }
    });

    // user sent some message
    socket.on('message', function(message) {        
        if (userName === false) { // first message sent by user is their name
            // remember user name
            userName = htmlEntities(message);
            console.log((new Date()) + ' User is known as: ' + userName);

        } else { // log and broadcast the message
            //console.log((new Date()) + ' Received Message from '
            //            + userName + ': ' + message.utf8Data);
            
            // we want to keep history of all sent messages
            var obj = {
                time: (new Date()).getTime(),
                text: message,
                author: userName,
                channel: channel
            };
            history.push(obj);
            
            new Chat(message, channel, userName).save(function(){}, function(){});

            channels[channel].history = history.slice(-100);

            // broadcast message to all connected clients
            var json = JSON.stringify({ type:'message', data: obj });
            for (var i=0; i < channels[channel].clients.length; i++) {
                channels[channel].clients[i].emit('message', json);
            }
        }
    });

    // user disconnected
    socket.on('disconnect', function(connection) {
        if (userName !== false) {
            console.log((new Date()) + " Peer "
                + userName + "(" + connection.remoteAddress + ") disconnected.");
            // remove user from the list of connected clients
            channels[channel].clients.splice(index, 1);
        }
    });

});