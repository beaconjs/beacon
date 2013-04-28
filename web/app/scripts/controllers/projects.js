'use strict';

angular.module('webApp')
  .controller('ProjectsCtrl', function ($scope, $http, $location) {
    $scope.addProject = function() {
        $http.post('http://localhost:3000/projects', { 
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
