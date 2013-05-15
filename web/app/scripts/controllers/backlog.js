'use strict';

angular.module('webApp')
  .controller('BacklogCtrl', function ($rootScope, $scope, sync, $location) {
    
    $scope.stories = {};
    $scope.epics = [];
    $scope.points = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];
    $scope.epic = {};
    $scope.story = {};

    var get = function(path, arr) {
        sync.get('/projects/' + $rootScope.project_id + path).success(function(res) { $scope[arr] = res || []; }).error(function() {
            console.log("error");
        });
    }

    get('/members', 'members');
    get('/sprints', 'sprints');

    sync.get('/projects/' + $rootScope.project_id + '/epics').success(function(res) { $scope.epics = res || []; }).error(function() {
        console.log("error");
    });

    $scope.getStories = function(epicId) {
        if ($scope.stories[epicId]) {
            $scope.stories[epicId] = null;
        } else {
            sync.get('/epics/' + $rootScope.project_id + '/stories').success(function(res) { $scope.stories[epicId] = res || []; }).error(function() {
                console.log("error");
            });
        }
    }

    $scope.addStory = function(epicId) {
        if ($scope.story.owner) $scope.story.owner_id = $scope.story.owner.id;
        if ($scope.story.sprint) $scope.story.sprint_id = $scope.story.sprint.id;
        sync.post('/epics/' + epicId + '/stories', $scope.story).success(function() { console.log('done'); }).error(function(e) { console.log(e); } );
    }

    $scope.addEpic = function() {
        sync.post('/projects/' + $rootScope.project_id + '/epics', $scope.epic).success(function() { console.log('done'); }).error(function(e) { console.log(e); } );
    }

  });
