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
        sync.post('/stories/' + $scope.story.id, $scope.story).success(function(res) { console.log("updated"); }).error(function() {
            console.log("error");
        });
        $scope.closePopup();
    }

    var dragSrcEl = null;

    function handleDragStart(e) {
      // Target (this) element is the source node.
      this.style.opacity = '0.4';

      dragSrcEl = this;

      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', this.innerHTML);
    }

    function handleDrop(e) {
      // this/e.target is current target element.
      if (e.stopPropagation) {
        e.stopPropagation(); // Stops some browsers from redirecting.
      }

      // Don't do anything if dropping the same column we're dragging.
      if (dragSrcEl != this) {
        // move the element by appending to the area dropped in.
        if ($(this).hasClass('lane')) {
            $(this).append(dragSrcEl);
        } else {
            $(this).parent().append(dragSrcEl);
        }
      }

      return false;
    }

    function handleDragOver(e) {
      this.style.opacity = '1';
      if (e.preventDefault) {
        e.preventDefault(); // Necessary. Allows us to drop.
      }

      e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

      return false;
    }

    function enableDragDrop(css, drag, drop) {
        var cols = document.querySelectorAll(css);
        [].forEach.call(cols, function(col) {
          if (drag) col.addEventListener('dragstart', handleDragStart, false);
          if (drop) {
              col.addEventListener('dragover', handleDragOver, false);
              col.addEventListener('drop', handleDrop, false);
          } 
        });
    }

    $(document).ready(function() {
        enableDragDrop('.story', true, true);
        enableDragDrop('.lane', false, true);

        $(document).bind('keydown', 'ctrl+b', function(e) {
          formatText('bold');
        });
    });

  });
