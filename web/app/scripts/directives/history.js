'use strict';

angular.module('webApp')
  .directive('history', function ($rootScope, sync) {
  return {
        restrict: 'E', //element only
        templateUrl: 'views/history.html',
        link: function($scope, element, attrs) {
            $rootScope.allNotifications = [];

            var load = function() {
                if ($rootScope.project_id) {
                    sync.get('/projects/' + $rootScope.project_id + '/notifications').success(function(res){
                        $rootScope.allNotifications = res || [];
                    }).error(function(e){
                       console.log(e);
                    });
                }
            }

            $rootScope.$watch('project_id', load);
            $rootScope.$watch('newNotifications', load);
        }
    }
  });
