'use strict';

angular.module('webApp')
.directive('dragDrop', function($rootScope) {
  return {
        restrict: 'A', //attribute only
        link: function(scope, element, attrs) {
          function handleDragStart(e) {
            // Target (this) element is the source node.
            this.style.opacity = '0.4';
      
            $rootScope.dragSrcEl = this;
      
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', this.innerHTML);
          }
      
          function handleDrop(e) {
            // this/e.target is current target element.
            if (e.stopPropagation) {
              e.stopPropagation(); // Stops some browsers from redirecting.
            }
      
            // Don't do anything if dropping the same column we're dragging.
            if ($rootScope.dragSrcEl != this) {
              // move the element by appending to the area dropped in.
              if ($(this).hasClass('lane')) {
                  $(this).append($rootScope.dragSrcEl);
                  scope.$parent.moveStory($rootScope.dragSrcEl.id, $(this).attr('data-status'));
              } else {
                  $(this).parent().append($rootScope.dragSrcEl);
                  scope.$parent.moveStory($rootScope.dragSrcEl.id, $(this).parent().attr('data-status'));
              }
              $rootScope.dragSrcEl = null;
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
              if (element.hasClass(css)) {
                if (drag) element.bind('dragstart', handleDragStart);
                if (drop) {
                    element.bind('dragover', handleDragOver);
                    element.bind('drop', handleDrop);
                }
              }
          }
      
          enableDragDrop('story', true, true);
          enableDragDrop('lane', false, true);
        }
    }
})
