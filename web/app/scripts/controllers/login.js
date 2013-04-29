'use strict';

angular.module('webApp')
  .controller('LoginCtrl', function ($rootScope, $scope, $http, $location) {
    $scope.username = "";
    $scope.password = "";

    $scope.authenticate = function() {
        $http.post('http://localhost:3000/authenticate', { 
            username: $scope.username, 
            password: $scope.password 
        }).success(function(response) {
            console.log(response);
            $rootScope.loggedInUser = response;
            $location.path("/");
        }).error(function(error) {
            console.log("error: " + error);
        });
    }
  });
