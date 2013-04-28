'use strict';

angular.module('webApp')
  .controller('HomeCtrl', function ($rootScope, $scope, $http) {
    $scope.projects = [];

    $http.get("http://localhost:3000/projects").success(function(res){
        $scope.projects = res;
    }).error(function(error){
        console.log(error);
    });

    $scope.select = function(id) {
        $rootScope.project_id = id;
    };

  });
