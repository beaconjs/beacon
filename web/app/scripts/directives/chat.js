'use strict';

angular.module('webApp')
  .directive('chat', function ($rootScope, sync) {
  return {
        restrict: 'E', //element only
        templateUrl: 'views/chat.html',
        link: function($scope, element, attrs) {

            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

            function chat(author, message, dt) {
                var m = dt ? moment(dt) : moment();
                var d = m.format('MMM Do, YYYY h:mm a');
                var msg = "";
                msg += message;
                msg += ' <span>' + d + "</span>";
                $('.chat-box').append("<div class='chat-row'><b>" + author + '</b> : ' + msg + "</div>");
                $('div.chat-box').scrollTo('div.chat-row:last');
            }

            $rootScope.chatChannels = $rootScope.chatChannels || {};
            $scope.members = [];

            var connection = $rootScope.chatChannels[$rootScope.project_id];

            var chat_initiated = connection != null;
            var myName = null;
            var options = {
                "cls": "notification-chat",
                "speed": 1000, //Fade-in / out animation speed
                "timeout": 10000 //Timeout before notification disappears
            };

            $scope.replace = function(name) {
                return name.replace(/ /g, '_');
            }

            $scope.sendChat = function() {
                myName = $rootScope.loggedInUser.name;
                if (!connection) startChat();

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

                // lets not connect if this channel is already open
                if (connection || !$rootScope.project_id) return;

                // for better performance - to avoid searching in DOM
                var content = $('.chat-box');
                var input = $('#chatMsg');
                var status = $('#status');
                var channel = 'project_' + $rootScope.project_id;

                if ($rootScope.project_id) {
                    sync.get('/projects/' + $rootScope.project_id + '/members').success(function(res) {
                        $scope.members = res || [];
                    }).error(function() {
                        console.log("error");
                    });
                }

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
                connection = new WebSocket($rootScope.appconfig.chatServer, channel);

                connection.onopen = function () {
                    //channel
                };

                connection.onclose = function () {
                    //channel
                    console.log("closed...");
                    $rootScope.chatChannels[$rootScope.project_id] = null;
                    connection = null;
                };

                connection.onerror = function (error) {
                    // just in there were some problems with conenction...
                    content.html($('<p>', { text: 'Sorry, but there\'s some problem with your '
                                                + 'connection or the server is down.' } ));
                    $rootScope.chatChannels[$rootScope.project_id] = null;
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

                    if (json.data.channel && json.data.channel !== channel) return;

                    // NOTE: if you're not sure about the JSON structure
                    // check the server source code above
                    if (json.type === 'history') { // entire message history
                        // insert every single message to the chat window
                        for (var i=0; i < json.data.length; i++) {
                            addMessage(json.data[i].author, json.data[i].text, new Date(json.data[i].time));
                        }
                    } else if (json.type === 'message') { // it's a single message
                        input.removeAttr('disabled'); // let the user write another message
                        addMessage(json.data.author, json.data.text, new Date(json.data.time));
                        $.Growl.show(json.data.author + ": " + json.data.text, options);
                    } else if (json.type === 'connection') {
                        $('#' + json.data.author.replace(/ /g, '_')).addClass("online");
                    } else if (json.type === 'disconnection') {
                        $('#' + json.data.author.replace(/ /g, '_')).removeClass("online");
                    } else {
                        console.log('Hmm..., I\'ve never seen JSON like this: ', json);
                    }
                };

                /**
                 * This method is optional. If the server wasn't able to respond to the
                 * in 3 seconds then show some error message to notify the user that
                 * something is wrong.
                 */
                setInterval(function() {
                    if (!connection || connection.readyState !== 1) {
                        status.text('Error : Unable to communicate ' + 'with the WebSocket server.');
                    }
                }, 3000);

                /**
                 * Add message to the chat window
                 */
                function addMessage(author, message, dt) {
                    chat(author, message, dt);
                }

                $rootScope.chatChannels[$rootScope.project_id] = connection;

            };

            var handleFileDrop = function(e) {
                if (e.stopPropagation) e.stopPropagation(); // Stops some browsers from redirecting.
                e.preventDefault();

                var dataTransfer = e.dataTransfer || e.originalEvent.dataTransfer;
                var files = dataTransfer.files;
                var formdata = new FormData();
                for (var i = 0, f; f = files[i]; i++) {
                    var reader = new FileReader();
                    reader.onloadend = function (e) {
                        //console.log(e.target.result);
                    };
                    reader.readAsDataURL(f);
                    formdata.append("file", f);
                }

                $.ajax({
                    url: $rootScope.appconfig.server + "/projects/" + $rootScope.project_id + "/upload",
                    type: "POST",
                    data: formdata,
                    processData: false,
                    contentType: false,
                    success: function (res) {
                        if (files && files.length > 0) {
                            var file = files[0];
                            if (!chat_initiated) {
                                chat_initiated = true;
                                connection.send($rootScope.loggedInUser.name);
                            }
                            if (file.type.match(/image.*/)) {
                                connection.send("<img src=\""+ $rootScope.appconfig.server + "/uploads/" + $rootScope.project_id + "/chat/" + file.name +"\" />");
                            } else {
                                connection.send("<a href=\""+ $rootScope.appconfig.server + "/uploads/" + $rootScope.project_id + "/chat/" + file.name +"\" target=\"_blank\">" +  file.name + "</a>");
                            }
                        }
                    }
                });
                return false;
            }

            var handleFileDragOver = function(e) {
                if (e.stopPropagation) e.stopPropagation();
                e.preventDefault();
                var dataTransfer = e.dataTransfer || e.originalEvent.dataTransfer;
                dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
                return false;
            }

            $(".chat-box").bind("dragover", handleFileDragOver);
            $(".chat-box").bind("drop", handleFileDrop);

            var addNote = function() {
                var title = prompt('Enter title for note');
                if (title) {
                    var html = window.getSelection().toString();

                    sync.post('/notes', {
                        title: title,
                        details: html,
                        project: $rootScope.project_id,
                        user: $rootScope.loggedInUser.id
                    }).success(function(o){
                        console.log("saved");
                    });
                }
                return false;
            }

            $('.chat-box').bind('contextmenu', addNote);

            $rootScope.$watch('project_id', startChat);
        }
    }
  });
