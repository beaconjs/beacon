'use strict';

angular.module('webApp')
  .controller('HomeCtrl', function ($rootScope, $scope, $http, $location) {
    $scope.projects = [];

    $http.get($rootScope.appconfig.server + "/projects").success(function(res){
        $scope.projects = res;
        if (res && res.length > 0) {
            $rootScope.project_id = res[0].id;
            $rootScope.project_name = res[0].name;
        }
    }).error(function(error){
        console.log(error);
    });

    $scope.select = function(id) {
        $rootScope.project_id = id;
        $location.path('notes');
    };

    $scope.edit = function(id) {
        $scope.select(id);
        $location.path('projects/edit');
    }

  });
