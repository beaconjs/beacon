'use strict';

angular.module('webApp')
  .controller('LoginCtrl', function ($rootScope, $scope, sync, $location) {
    $scope.username = "";
    $scope.password = "";

    $scope.authenticate = function() {
        sync.post('/authenticate', {
            username: $scope.username,
            password: $scope.password
        }).success(function(response) {
            $rootScope.loggedInUser = response;
            $location.path("/");
        }).error(function(error) {
            console.log("error: " + error);
        });
    };

    $scope.signup = function() {
        sync.post('/users', $scope.user).success(function(response) {
            $scope.user = {};
            $scope.showSignup = false;
        }).error(function(error) {
            console.log("error: " + error);
        });
    };

  });
