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
                        var r = res || [];
                        $rootScope.allNotifications = [];
                        var last = null;
                        var notifications = [];
                        _.each(r, function(o){
                            var m = moment(o.created_at).startOf('day');
                            if (!last || !last.isSame(m)) {
                                last = m;
                                notifications = [];
                                $rootScope.allNotifications.push({date: last.toDate(), notifications: notifications});
                            }
                            notifications.push(o);
                        });
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
