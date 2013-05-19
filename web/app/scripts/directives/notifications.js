'use strict';

angular.module('webApp')
  .directive('notifications', function ($rootScope) {
  return {
        restrict: 'E', //element only
        template: '',
        link: function($scope, element, attrs) {
            window.WebSocket = window.WebSocket || window.MozWebSocket;
            // open connection
            var connection = new WebSocket($rootScope.appconfig.notifications);
            connection.onmessage = function (message) {
                try {
                    var json = JSON.parse(message.data);
                    $.Growl.show(json.message);
                } catch (e) {
                    console.log('This doesn\'t look like a valid JSON: ', message.data);
                    return;
                }
            }
        }
    }
  });
