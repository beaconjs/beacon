'use strict';

angular.module('webApp')
  .controller('ProjectsCtrl', function ($rootScope, $scope, $http, $location) {
    $scope.addProject = function() {
        $http.post($rootScope.appconfig.server + '/projects', { 
            name: $scope.project.name, 
            description: $scope.project.description 
        }).success(function() {
            console.log("done");
            $location.path("/");
        }).error(function() {
            console.log("error");
        });
    };
  });
