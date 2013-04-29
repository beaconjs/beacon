'use strict';

angular.module('webApp')
  .controller('ChatCtrl', function ($rootScope, $scope, $http) {

    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    function chat(author, message) {
        var d = moment().format('MMM Do, YYYY h:mm a');
        var msg = "";
        msg += message;
        msg += ' <span>' + d + "</span>";
        $('.chat-box').append("<div class='chat-row'><b>" + author + '</b> : ' + msg + "</div>");
        $('div.chat-box').scrollTo('div.chat-row:last');
    }

    var channel = 'project_' + $rootScope.project_id;
    var connection = null;

    var chat_initiated = false;
    var myName = $rootScope.loggedInUser.name;

    $scope.sendChat = function() {
        if (!chat_initiated) { 
            chat_initiated = true;
            connection.send(myName);
        }
        var msg = $('#chatMsg').val();
        if (!msg) {
            return;
        }
        // send the message as an ordinary text
        connection.send(msg);
        $('#chatMsg').val('');
        // disable the input field to make the user wait until server
        // sends back response
        //$('#chatMsg').attr('disabled', 'disabled');
    }


    var startChat = function () {
        "use strict";
     
        // for better performance - to avoid searching in DOM
        var content = $('.chat-box');
        var input = $('#chatMsg');
        var status = $('#status');
     
        // my color assigned by the server
        var myColor = false;
        // my name sent to the server
     
        // if user is running mozilla then use it's built-in WebSocket
        window.WebSocket = window.WebSocket || window.MozWebSocket;
     
        // if browser doesn't support WebSocket, just show some notification and exit
        if (!window.WebSocket) {
            content.html($('<p>', { text: 'Sorry, but your browser doesn\'t '
                                        + 'support WebSockets.'} ));
            input.hide();
            $('span').hide();
            return;
        }
     
        // open connection
        connection = new WebSocket('ws://127.0.0.1:1337', channel);

        connection.onopen = function () {
            //channel
        };
     
        connection.onerror = function (error) {
            // just in there were some problems with conenction...
            content.html($('<p>', { text: 'Sorry, but there\'s some problem with your '
                                        + 'connection or the server is down.' } ));
        };
     
        // most important part - incoming messages
        connection.onmessage = function (message) {
            // try to parse JSON message. Because we know that the server always returns
            // JSON this should work without any problem but we should make sure that
            // the massage is not chunked or otherwise damaged.
            try {
                var json = JSON.parse(message.data);
            } catch (e) {
                console.log('This doesn\'t look like a valid JSON: ', message.data);
                return;
            }

            if (json.data.channel !== channel) return;
     
            // NOTE: if you're not sure about the JSON structure
            // check the server source code above
            if (json.type === 'color') { // first response from the server with user's color
                myColor = json.data;
                input.removeAttr('disabled').focus();
                // from now user can start sending messages
            } else if (json.type === 'history') { // entire message history
                // insert every single message to the chat window
                for (var i=0; i < json.data.length; i++) {
                    addMessage(json.data[i].author, json.data[i].text,
                               json.data[i].color, new Date(json.data[i].time));
                }
            } else if (json.type === 'message') { // it's a single message
                input.removeAttr('disabled'); // let the user write another message
                addMessage(json.data.author, json.data.text,
                           json.data.color, new Date(json.data.time));
            } else {
                console.log('Hmm..., I\'ve never seen JSON like this: ', json);
            }
        };
     
        /**
         * Send mesage when user presses Enter key
         */
        /*input.keydown(function(e) {
            if (e.keyCode === 13) {
                sendChat();
            }
        });*/
     
        /**
         * This method is optional. If the server wasn't able to respond to the
         * in 3 seconds then show some error message to notify the user that
         * something is wrong.
         */
        setInterval(function() {
            if (connection.readyState !== 1) {
                status.text('Error');
                input.attr('disabled', 'disabled').val('Unable to comminucate '
                                                     + 'with the WebSocket server.');
            }
        }, 3000);
     
        /**
         * Add message to the chat window
         */
        function addMessage(author, message, color, dt) {
            chat(author, message);
        }
    };

    startChat();
  });
