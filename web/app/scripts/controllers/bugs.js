'use strict';

angular.module('webApp')
  .controller('BugsCtrl', function ($rootScope, $scope, sync, $location) {

    $scope.bug = { user: $rootScope.loggedInUser.id };

    var loadBugs = function() {
        sync.get('/projects/' + $rootScope.project_id + '/bugs').success(function(res) {
            $scope.bugs = res || {};
        }).error(function() {
            console.log("error");
        });
    }

    loadBugs();

    $scope.add = function() {
        sync.post('/projects/' + $rootScope.project_id + '/bugs', $scope.bug).success(function(res) {
            $scope.bug = { user: $rootScope.loggedInUser.id };
            loadBugs();
        }).error(function() {
            console.log("error");
        });
    };

    $scope.load = function(id) {
        $location.path("/bugs/" + id)
    }
  });

angular.module('webApp')
  .controller('EditBugsCtrl', function ($rootScope, $scope, sync, $location, $routeParams) {

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
            $location.path("/bugs");
        }).error(function() {
            console.log("error");
        });
    };

  });
