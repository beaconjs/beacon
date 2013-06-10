'use strict';

angular.module('webApp')
  .directive('bugs', function ($rootScope, sync) {
  return {
        restrict: 'E', //element only
        templateUrl: 'views/bugs/form.html',
        scope: {},
        link: function(scope, element, attrs) {
            scope.addBug = function() {
                scope.bug.owner_id = scope.bug.owner ? scope.bug.owner.id : null;
                sync.post('/projects/' + $rootScope.project_id + '/bugs', scope.bug).success(function(res) {
                    scope.bug = { user: $rootScope.loggedInUser.id };
                }).error(function() {
                    console.log("error");
                });
            };

            scope.config = { bugs: {} };
            scope.config.bugs.statuses = ['New', 'Open', 'Fixed', 'Released', 'Invalid', 'Closed'];
            scope.config.bugs.priorities = ['High', 'Medium', 'Low', 'Trivial'];
            $rootScope.$watch('project_id', function() {
                if ($rootScope.project_id) {
                    sync.get("/projects/" + $rootScope.project_id + "/members").success(function(res){
                        var owners = res || [];
                        scope.config.bugs.owners = _.map(owners, function(o){
                            return o.user;
                        });
                    }).error(function(error){
                        console.log(error);
                    });
                }
            });
        }
    }
  });
