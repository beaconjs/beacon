'use strict';

angular.module('webApp')
  .controller('NotesCtrl', function ($rootScope, $scope, sync, $routeParams) {
    $scope.note_id = null;
    $scope.notes = [];
    $scope.notify = false;

    $scope.ann = { user_id: $rootScope.loggedInUser.id };

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
            sync.post('/projects/' + $rootScope.project_id + '/' + $scope.note_id + '/annotations', $scope.ann).success(function(o){
                console.log("saved");
                $scope.loadComments();
                $scope.comment = {};
            });
            $scope.ann = { filename: $scope.ann.filename, user_id: $rootScope.loggedInUser.id };
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
            x + "px;' id='" + id + "'><div class='pin pink'></div><div class='ann-inner' style='display:block'><div class='close' onclick='closeAnnotation($(this))'></div><div contenteditable onblur='saveAnnotation($(this).html(), " + 
                x + ", " + y + ", $(this))'></div></div></div>");
       });

      loadAnnotations(filename);
    }

    $scope.isImage = function(filename) {
        return filename && (filename.toLowerCase().indexOf("jpg") || filename.toLowerCase().indexOf("jpeg") || filename.toLowerCase().indexOf("gif") || filename.toLowerCase().indexOf("png"));
    }

    var autosave = function(){
        if ((!$scope.note_id && !isBlank($scope.notetitle)) || $scope.note_id) {
            var modified = true;
            if ($scope.originalNote) {
                modified = ($scope.originalNote.details !== $('#notedetails').val()) || ($scope.originalNote.title !== $scope.notetitle);
            }

            if (!modified) return;

            sync.post('/notes', {
                id: $scope.note_id,
                title: $scope.notetitle,
                details: $('#notedetails').val(),
                project: $rootScope.project_id,
                user: $rootScope.loggedInUser.id,
                notify: $scope.notify
            }).success(function(o){
                $scope.notify = false;
                if (o.id) {
                    $('#notedetails-msg').html("Autosaved at " + (new Date()));

                    if (!$scope.note_id) {
                        $scope.notes.push({
                            id: o.id,
                            title: $scope.notetitle
                        });
                    } else {
                        var note = _.find($scope.notes, function(n){
                            return n.id === o.id;
                        });
                        note.title = $scope.notetitle;
                    }
                    $scope.note_id = o.id;
                }
            });
        }
    };

    $scope.$watch('notedetails', autosave);
    $scope.$watch('notetitle', autosave);

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
                $scope.originalNote = res;
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

    var loadAnnotations = function(filename) {
        $('.img-annotation').remove();
        if ($scope.note_id && filename) {
            sync.post('/projects/'+ $rootScope.project_id + '/' + $scope.note_id + '/annotations/list', { filename: filename }).success(function(res) {
                _.each(res, function(o){
                    var x = o.posx;
                    var y = o.posy;
                    var id = "ann-" + x + "-" + y;
                    var text = o.todos.title;
                    var css = "img-annotation";
                    if (o.todos.status === "Done") css += " done";
                    var pinColor = (o.todos.status === "Done") ? "green" : "pink";
                    $('#previewImgDiv').append("<div class='" + css + "' style='position:absolute;top:" + y + "px;left:" + 
                            x + "px;' id='" + id + "'><div class='pin " + pinColor + "'></div><div class='ann-inner'><div class='close' onclick='closeAnnotation($(this))'></div><div contenteditable onblur='saveAnnotation($(this).html(), " + 
                            x + ", " + y + ", $(this))'></div>" + text + "</div></div>");
                });

                window.setTimeout(function(){
                    $(".pin").click(function(p){
                        $(this).parent().find(".ann-inner").toggle();
                    })
                }, 1000);
            }).error(function() {
                console.log("error");
            });
        }
    }

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

    var paramNoteId = $routeParams.id || null;
    if (paramNoteId) {
        $scope.notify = true;
        $scope.load(paramNoteId);
    }
  });

function saveAnnotation(text, x, y) {
    var scope = angular.element($('#previewImgDiv')).scope();

    if (scope) { 
        scope.ann = {
            text: text,
            x: x,
            y: y,
            filename: scope.ann.filename,
            user_id: scope.ann.user_id
        }
        scope.$apply();
    }
}

function closeAnnotation(obj) {
    obj.parent().parent().remove();
}
