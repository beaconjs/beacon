'use strict';

angular.module('webApp')
  .directive('notifications', function ($rootScope) {
  return {
        restrict: 'E', //element only
        template: '',
        link: function($scope, element, attrs) {

            var options = {
                "cls": "notification-info",
                "speed": 1000, //Fade-in / out animation speed
                "timeout": 3000 //Timeout before notification disappears
            };

            var connect = function(channel) {
                // open connection
                var socket = io.connect($rootScope.appconfig.notifications);
                socket.emit("channel", channel);
                $rootScope.notificationChannels[channel] = true;

                socket.on('message', function (message) {
                    try {
                        var json = JSON.parse(message);
                        if (json.type !== "refresh") {
                            json.issuer = json.issuer || { name: "" };
                            json.issuer.name = json.issuer.name || "";

                            $.Growl.show(json.issuer.name + ": " + json.message, options);
                        }
                        $rootScope.newNotifications = $rootScope.newNotifications || 0;
                        $rootScope.newNotifications += 1;
                    } catch (e) {
                        console.log(e);
                        console.log('This doesn\'t look like a valid JSON: ', message);
                        return;
                    }
                });
            }

            var start = function() {
                $rootScope.notificationChannels = $rootScope.notificationChannels || {};

                _.each($rootScope.userProjects, function(project_id){
                    var channel = 'project_' + project_id;

                    if (!$rootScope.notificationChannels[channel]) connect(channel);
                })
            }

            $rootScope.$watch('userProjects', start);
        }
    }
  });
