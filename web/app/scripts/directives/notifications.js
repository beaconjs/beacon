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
                window.WebSocket = window.WebSocket || window.MozWebSocket;
                // open connection
                var connection = new WebSocket($rootScope.appconfig.notifications, channel);
                $rootScope.notificationChannels[channel] = true;

                connection.onmessage = function (message) {
                    try {
                        var json = JSON.parse(message.data);
                        if (json.type !== "refresh") {
                            $.Growl.show(json.issuer.name + ": " + json.message, options);
                        }
                        $rootScope.newNotifications = $rootScope.newNotifications || 0;
                        $rootScope.newNotifications += 1;
                    } catch (e) {
                        console.log(e);
                        console.log('This doesn\'t look like a valid JSON: ', message.data);
                        return;
                    }
                }
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
