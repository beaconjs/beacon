'use strict';

angular.module('webApp')
  .controller('BugsCtrl', function ($rootScope, $scope, sync, $location, $routeParams) {

    $scope.bug = {};
    $scope.config = { bugs: {} };
    $scope.config.bugs = $rootScope.appconfig.bugs;

    sync.get('/projects/' + $rootScope.project_id + '/bugs/' + $routeParams.id).success(function(res) {
        $scope.bug = res || {};
        $scope.loadComments();
    }).error(function() {
        console.log("error");
    });

    $scope.save = function() {
        $scope.bug.user = $rootScope.loggedInUser.id;
        
        sync.post('/projects/' + $rootScope.project_id + '/bugs', $scope.bug).success(function(res) {
            console.log("done");
            $scope.bug = {};
            $location.path("/dashboard");
        }).error(function() {
            console.log("error");
        });
    };

    $scope.loadComments = function() {
        if ($scope.bug) {
            sync.get('/bugs/' + $scope.bug.id + '/comments').success(function(res) {
                $scope.comments = res || [];
            }).error(function() {
                console.log("error");
            });
        }
    };

    $scope.addComment = function() {
        sync.post('/bugs/' + $scope.bug.id + '/comments', {
            details: $scope.comment.details,
            user: { id: $rootScope.loggedInUser.id, name: $rootScope.loggedInUser.name },
            project_id: $rootScope.project_id,
            project_name: $rootScope.project_name,
            note_title: $scope.bug.title
        }).success(function(o){
            console.log("saved");
            $scope.loadComments();
            $scope.comment = {};
        });
    }

  });
