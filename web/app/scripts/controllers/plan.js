'use strict';

angular.module('webApp')
  .controller('PlanCtrl', function ($rootScope, $scope, sync) {

    $scope.lanes = [];
    $scope.members = [];
    $scope.sprints = [];
    $scope.stories = [];
    $scope.story = {};

    var get = function(path, arr, callback) {
        sync.get('/projects/' + $rootScope.project_id + path, {}).success(function(res) { 
          $scope[arr] = res || []; 
          if (callback) callback(); 
        }).error(function() {
            console.log("error");
        });
    }

    var getCurrentSprint = function() {
      sync.get('/projects/' + $rootScope.project_id + '/sprints/current', {}).success(function(res) {
        $scope.sprint = res || {};
        $scope.sprint = _.find($scope.sprints, function(s) {
          return s.id === $scope.sprint.id;
        });
        $scope.sprint = $scope.sprint || {};
      }).error(function() {
          console.log("error");
      });
    }

    get('/members', 'members');
    get('/lanes', 'lanes');
    get('/sprints', 'sprints', getCurrentSprint);

    $scope.$watch("sprint", function(){
      if ($scope.sprint && $scope.sprint.id) {
        sync.get('/sprints/' + $scope.sprint.id + '/stories', {}).success(function(s) { $scope.stories = s || []; }).error(function() {
            console.log("error");
        });
      }
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
        $scope.story.owner_id = $scope.story.owner.id;

        sync.post('/stories/' + $scope.story.id, $scope.story).success(function(res) { 
          var st = _.find($scope.stories, function(s){
            return s.id === $scope.story.id;
          });
          st.title = $scope.story.title;
          st.points = $scope.story.points;
          st.owner = $scope.story.owner;
          st.user = $scope.story.user;
          st.owner_id = $scope.story.owner_id;
          st.details = $scope.story.details;

        }).error(function() {
            console.log("error");
        });
        $scope.closePopup();
    }

  });
