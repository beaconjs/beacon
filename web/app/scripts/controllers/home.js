'use strict';

angular.module('webApp')
  .controller('HomeCtrl', function ($rootScope, $scope, $http) {
    $scope.projects = [];

    $http.get($rootScope.appconfig.server + "/projects").success(function(res){
        $scope.projects = res;
        if (res && res.length > 0) {
            $scope.select(res[0].id);
        }
    }).error(function(error){
        console.log(error);
    });

    $scope.select = function(id) {
        $rootScope.project_id = id;
    };

  });
