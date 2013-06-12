'use strict';

angular.module('webApp')
  .directive('bugs', function ($rootScope, sync) {
  return {
        restrict: 'E', //element only
        templateUrl: 'views/bugs/form.html',
        link: function(scope, element, attrs) {
            scope.addBug = function() {
                scope.bug.owner_id = scope.bug.owner ? scope.bug.owner.id : null;
                sync.post('/projects/' + $rootScope.project_id + '/bugs', scope.bug).success(function(res) {
                    scope.bug = { user: $rootScope.loggedInUser.id };
                }).error(function() {
                    console.log("error");
                });
            };

            scope.config = scope.config || { bugs: {} };
            scope.config.bugs = $rootScope.appconfig.bugs;
            scope.config.bugs.owners = $rootScope.appconfig.project_members;
            $rootScope.$watch("appconfig.project_members", function(){
                scope.config.bugs.owners = $rootScope.appconfig.project_members;
            });
        }
    }
  });
