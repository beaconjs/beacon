'use strict';

angular.module('webApp')
  .controller('LoginCtrl', function ($rootScope, $scope, $http, $location) {
    $scope.username = "";
    $scope.password = "";

    $scope.authenticate = function() {
        $http.post($rootScope.appconfig.server + '/authenticate', { 
            username: $scope.username, 
            password: $scope.password 
        }).success(function(response) {
            $rootScope.loggedInUser = response;
            $location.path("/");
        }).error(function(error) {
            console.log("error: " + error);
        });
    }
  });
