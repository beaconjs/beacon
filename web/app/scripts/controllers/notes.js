'use strict';

angular.module('webApp')
  .controller('NotesCtrl', function ($rootScope, $scope, sync) {
    $scope.note_id = null;
    $scope.notes = [];

    sync.get("/projects/" + $rootScope.project_id + "/notes").success(function(res){
        $scope.notes = res;
    }).error(function(error){
        console.log(error);
    });

    function isBlank(str) {
        return (!str || /^\s*$/.test(str));
    }

    $scope.$watch('notedetails', function(){
        if ((!$scope.note_id && !isBlank($scope.notedetails)) || $scope.note_id) {
            sync.post('/notes', {
                id: $scope.note_id,
                title: $scope.notetitle,
                details: $('#notedetails').val(),
                project: $rootScope.project_id,
                user: $rootScope.loggedInUser.id
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
        var notesDropzone = new Dropzone('form#notedetails-dropzone-form'); //Dropzone.forElement("#notedetails-dropzone-form");
        notesDropzone.on("addedfile", function(file) {
          $scope.loadAttachments();
        });
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
            user: $rootScope.loggedInUser.id
        }).success(function(o){
            console.log("saved");
            $scope.comments.push({ details: $scope.comment.details, user: { name: $rootScope.loggedInUser.name }, created_at: new Date() });
            $scope.comment = {};
        });
    }
  });
