'use strict';

angular.module('webApp')
  .controller('NotesCtrl', function ($rootScope, $scope, sync) {
    $scope.note_id = null;
    $scope.notes = [];
    $scope.notify = false;

    $scope.ann = {};

    sync.get("/projects/" + $rootScope.project_id + "/notes").success(function(res){
        $scope.notes = res;
    }).error(function(error){
        console.log(error);
    });

    function isBlank(str) {
        return (!str || /^\s*$/.test(str));
    }

    $scope.$watch('note_id', function(){
        $scope.notify = true;
    });

    $scope.$watch('ann', function(){
        if ($scope.ann.text) {
            console.log($scope.ann);
            var visible = $('#ann-' + $scope.ann.x + '-' + $scope.ann.y ).is(':visible');
            console.log(visible);
            $scope.ann = { filename: $scope.ann.filename };
        }
    });

    $scope.showImgPreview = false;

    $scope.preview = function(project_id, note_id, filename) {
        var imgurl = $rootScope.appconfig.server + "/uploads/" + $rootScope.project_id + "/" + $scope.note_id + "/" + filename;
        $("#previewImgDivInner").html("<img src=\"" + imgurl + "\" class=\"annotatable\" id=\"imgPreview\" />");
        $scope.showImgPreview = true;
        $("#previewImgDivInner").click(function(e){
          var x = Math.round(e.pageX  - $(this).parent().offset().left);
          var y = Math.round(e.pageY - $(this).parent().offset().top);
          $scope.ann.filename = filename;
          var id = "ann-" + x + "-" + y;

          $(this).parent().append("<div class='img-annotation' style='position:absolute;top:" + y + "px;left:" + 
            x + "px;' id='" + id + "'><div class='close' onclick='closeAnnotation($(this))'></div><div contenteditable onblur='saveAnnotation($(this).html(), " + 
                x + ", " + y + ", $(this))'></div></div>");
       });
    }

    $scope.isImage = function(filename) {
        return filename && (filename.toLowerCase().indexOf("jpg") || filename.toLowerCase().indexOf("jpeg") || filename.toLowerCase().indexOf("gif") || filename.toLowerCase().indexOf("png"));
    }

    $scope.$watch('notedetails', function(){
        if ((!$scope.note_id && !isBlank($scope.notedetails)) || $scope.note_id) {
            sync.post('/notes', {
                id: $scope.note_id,
                title: $scope.notetitle,
                details: $('#notedetails').val(),
                project: $rootScope.project_id,
                user: $rootScope.loggedInUser.id,
                notify: $scope.notify
            }).success(function(o){
                if (o.id) {
                    if (!$scope.note_id) {
                        $scope.notes.push({
                            id: o.id,
                            title: $scope.notetitle
                        });
                    }
                    $scope.note_id = o.id;
                }
            });
        }
    });

    $scope.attachFile = function(insert) {
        $('#notedetails-dropzone-container').show();
        var notesDropzone = new Dropzone('form#notedetails-dropzone-form'); //;
        notesDropzone.on("addedfile", function(file) {
          $scope.loadAttachments();
        });
        notesDropzone.on("complete", function(file) {
          notesDropzone.removeFile(file);
          $scope.loadAttachments();
          $('#notedetails-dropzone-container').hide();
          notesDropzone.disable();
        });
    }

    $scope.closeDropZone = function() {
        $('#notedetails-dropzone-container').hide();
    }


    $scope.load = function(id) {
        sync.get('/projects/' + $rootScope.project_id + '/notes/' + id).success(function(res) {
            $scope.note_id = id;
            if (res) {
                $('#notedetails_div').html(res.details);
                $scope.notetitle = res.title;
                $('#notedetails').val(res.details);
                $scope.loadComments();
                $scope.loadAttachments();
                $scope.comment = {};
            }
        }).error(function() {
            console.log("error");
        });
    }

    $scope.loadComments = function() {
        if ($scope.note_id) {
            sync.get('/notes/' + $scope.note_id + '/comments').success(function(res) {
                $scope.comments = res || [];
            }).error(function() {
                console.log("error");
            });
        }
    };

    $scope.loadAttachments = function() {
        if ($scope.note_id) {
            sync.get('/notes/' + $scope.note_id + '/attachments', {}).success(function(res) {
                $scope.attachments = res || [];
            }).error(function() {
                console.log("error");
            });
        }
    };

    $scope.addComment = function() {
        sync.post('/notes/' + $scope.note_id + '/comments', {
            details: $scope.comment.details,
            user: { id: $rootScope.loggedInUser.id, name: $rootScope.loggedInUser.name },
            project_id: $rootScope.project_id,
            project_name: $rootScope.project_name,
            note_title: $scope.notetitle
        }).success(function(o){
            console.log("saved");
            $scope.loadComments();
            $scope.comment = {};
        });
    }
  });

function saveAnnotation(text, x, y) {
    var scope = angular.element($('#previewImgDiv')).scope();

    if (scope) { 
        scope.ann = {
            text: text,
            x: x,
            y: y,
            filename: scope.ann.filename
        }
        scope.$apply();
    }
}

function closeAnnotation(obj) {
    obj.parent().hide();
}
