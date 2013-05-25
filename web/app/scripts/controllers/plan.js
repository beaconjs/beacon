'use strict';

angular.module('webApp')
  .controller('PlanCtrl', function ($rootScope, $scope, sync) {

    $scope.lanes = [];
    $scope.members = [];
    $scope.stories = [];
    $scope.story = {};

    var get = function(path, arr) {
        sync.get('/projects/' + $rootScope.project_id + path, {}).success(function(res) { $scope[arr] = res || []; }).error(function() {
            console.log("error");
        });
    }

    get('/members', 'members');
    get('/lanes', 'lanes');

    sync.get('/projects/' + $rootScope.project_id + '/sprints/current', {}).success(function(res) {
      $scope.sprint = res || {};
      sync.get('/sprints/' + $scope.sprint.id + '/stories', {}).success(function(s) { $scope.stories = s || []; }).error(function() {
          console.log("error");
      });
    }).error(function() {
        console.log("error");
    });

    $scope.addStory = function() {
        $("#fade").show();
        $("#newStory").show();
    }

    $scope.closePopup = function() {
        $("#fade").hide();
        $("#newStory").hide();
        return false;
    }

    $scope.canMoveStory = function(storyId, max, status) {
      var sID = parseInt(storyId.replace("story_", ""), 10);
      var total = _.reduce($scope.stories, function(t, story){ return story.status === status ? t + 1 : t; }, 0);

      if (total >= max) {
        alert("Can not move this story as the targetted lane will have too many stories");
        return false;
      }
      return true;
    }

    $scope.moveStory = function(storyId, status) {

      var sID = parseInt(storyId.replace("story_", ""), 10);
      var story = _.find($scope.stories, function(s){
        return s.id === sID;
      });
      if (story) {
        story.status = status;
        story.modified_by = $rootScope.loggedInUser.id;
        sync.post('/stories/' + story.id, story).success(function(res) { console.log("updated"); }).error(function() {
            console.log("error");
        });
      }
    }

    $scope.openStory = function(id) {
        sync.get('/stories/' + id).success(function(s) {
          $scope.story = s || {};
          $scope.story.owner = (s && s.owner_id) ? _.find($scope.members, function(m) { return m.id === s.owner_id; }) : null;
        }).error(function() {
            console.log("error");
        });
        $("#fade").show();
        $("#newStory").show();
    }

    $scope.saveStory = function() {
        $scope.story.modified_by = $rootScope.loggedInUser.id;
        sync.post('/stories/' + $scope.story.id, $scope.story).success(function(res) { console.log("updated"); }).error(function() {
            console.log("error");
        });
        $scope.closePopup();
    }

  });
