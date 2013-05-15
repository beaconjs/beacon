'use strict';

angular.module('webApp')
  .controller('BacklogCtrl', function ($rootScope, $scope, sync, $location) {
    
    $scope.stories = {};
    $scope.epics = [];

    sync.get('/projects/' + $rootScope.project_id + '/epics', {}).success(function(res) { $scope.epics = res || []; }).error(function() {
        console.log("error");
    });

    $scope.getStories = function(epicId) {
        if ($scope.stories[epicId]) {
            $scope.stories[epicId] = null;
        } else {
            sync.get('/epics/' + $rootScope.project_id + '/stories', {}).success(function(res) { $scope.stories[epicId] = res || []; }).error(function() {
                console.log("error");
            });
        }
    }
  });
