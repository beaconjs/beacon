'use strict';

angular.module('webApp')
  .controller('BugsCtrl', function ($rootScope, $scope, sync, $location) {

    $scope.bug = {};

    sync.get('/projects/' + $rootScope.project_id + '/bugs').success(function(res) {
        $scope.bugs = res || {};
    }).error(function() {
        console.log("error");
    });

    $scope.add = function() {
        sync.post('/projects/' + $rootScope.project_id + '/bugs', $scope.bug).success(function(res) {            
            console.log("done");
            $location.path("/bugs");
        }).error(function() {
            console.log("error");
        });
    };
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
        sync.post('/projects/' + $rootScope.project_id + '/bugs', $scope.bug).success(function(res) {            
            console.log("done");
            $scope.bug = {};
            $location.path("/bugs");
        }).error(function() {
            console.log("error");
        });
    };

  });
