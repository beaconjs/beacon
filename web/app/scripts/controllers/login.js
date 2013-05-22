'use strict';

angular.module('webApp')
  .controller('LoginCtrl', function ($rootScope, $scope, sync, $location) {
    $scope.username = "";
    $scope.password = "";

    $scope.authenticate = function() {
        var hash = CryptoJS.SHA512($scope.password);

        sync.post('/authenticate', { 
            username: $scope.username, 
            password: hash.toString(CryptoJS.enc.Hex) 
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
