function addStory() {
    $("#fade").show();
    $("#newStory").show();
}

function closePopup() {
    $("#fade").hide();
    $("#newStory").hide();
    return false;
}

function openStory(id) {
    $("#storyTitle").val('test test');
    $("#storyDetails").val('test test test test test test test test test test');

    $("#fade").show();
    $("#newStory").show();
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
});
