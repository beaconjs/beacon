'use strict';

angular.module('webApp')
  .controller('BugsCtrl', function ($rootScope, $scope, sync, $location, $routeParams) {

    $scope.bug = {};

    sync.get('/projects/' + $rootScope.project_id + '/bugs/' + $routeParams.id).success(function(res) {
        $scope.bug = res || {};
    }).error(function() {
        console.log("error");
    });

    $scope.save = function() {
        $scope.bug.user = $rootScope.loggedInUser.id;
        
        sync.post('/projects/' + $rootScope.project_id + '/bugs', $scope.bug).success(function(res) {
            console.log("done");
            $scope.bug = {};
            $location.path("/dashboard");
        }).error(function() {
            console.log("error");
        });
    };

  });
