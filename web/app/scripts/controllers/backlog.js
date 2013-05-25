'use strict';

angular.module('webApp')
  .controller('BacklogCtrl', function ($rootScope, $scope, sync, $location) {
    
    $scope.stories = {};
    $scope.epics = [];
    $scope.points = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];
    $scope.epic = {};
    $scope.story = {};
    $scope.statuses = [];

    $scope.projectMembers = {};
    $scope.projectSprints = {};

    var get = function(path, arr, mapping) {
        sync.get('/projects/' + $rootScope.project_id + path).success(function(res) { 
            $scope[arr] = res || []; 
            _.each($scope[arr], function(a) {
                $scope[mapping][a.id] = a;
            });
        }).error(function() {
            console.log("error");
        });
    }

    get('/members', 'members', 'projectMembers');
    get('/sprints', 'sprints', 'projectSprints');

    sync.get('/projects/' + $rootScope.project_id + '/lanes').success(function(res) { 
        $scope.statuses = []; 
        _.each(res, function(o){
            $scope.statuses.push(o.status);
        });
    }).error(function() {
        console.log("error");
    });

    var getEpics = function() {
        sync.get('/projects/' + $rootScope.project_id + '/epics').success(function(res) { $scope.epics = res || []; }).error(function() {
            console.log("error");
        });
    };

    getEpics();

    $scope.getStories = function(epicId, force) {
        if (!force && $scope.stories[epicId]) {
            $scope.stories[epicId] = null;
        } else {
            sync.get('/epics/' + epicId + '/stories').success(function(res) { $scope.stories[epicId] = res || []; }).error(function() {
                console.log("error");
            });
        }
    }

    $scope.addStory = function(epicId) {
        if ($scope.story.owner) $scope.story.owner_id = $scope.story.owner.id;
        if ($scope.story.sprint) $scope.story.sprint_id = $scope.story.sprint.id;
        $scope.story.created_by = $rootScope.loggedInUser.id;
        sync.post('/epics/' + epicId + '/stories', $scope.story).success(function() { $scope.getStories(epicId, true); }).error(function(e) { console.log(e); } );
    }

    $scope.saveStory = function() {
        if ($scope.storyDetails.owner) $scope.storyDetails.owner_id = $scope.storyDetails.owner.id;
        if ($scope.storyDetails.sprint) $scope.storyDetails.sprint_id = $scope.storyDetails.sprint.id;
        $scope.storyDetails.modified_by = $rootScope.loggedInUser.id;
        sync.post('/stories/' + $scope.storyDetails.id, $scope.storyDetails).success(function(res) { 
            $scope.getStories($scope.storyDetails.epic_id, true); 
            $scope.showStory = false;
        }).error(function() {
            console.log("error");
        });
    }

    $scope.loadStory = function(epicId, storyId) {
        var s = _.find($scope.stories[epicId], function(s){
            return s.id === storyId;
        })
        $scope.storyDetails = jQuery.extend(true, {}, s);
        if ($scope.storyDetails.owner_id) $scope.storyDetails.owner = $scope.projectMembers[$scope.storyDetails.owner_id];
        if ($scope.storyDetails.sprint_id) $scope.storyDetails.sprint = $scope.projectSprints[$scope.storyDetails.sprint_id];

        $scope.showStory = true;
    }

    $scope.closeStoryPane = function() {
        $scope.storyDetails = {};
        $scope.showStory = false;
    }

    $scope.addEpic = function() {
        $scope.epic.status = "not_started";
        sync.post('/projects/' + $rootScope.project_id + '/epics', $scope.epic).success(function() { getEpics(); }).error(function(e) { console.log(e); } );
    }

  });
