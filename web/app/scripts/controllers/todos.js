'use strict';

angular.module('webApp')
  .controller('TodosCtrl', function ($rootScope, $scope, sync, $location, $routeParams) {

    $scope.todo = {};
    $scope.config = { todos: {} };
    $scope.config.todos = $rootScope.appconfig.todos;

    sync.get('/projects/' + $rootScope.project_id + '/todos/' + $routeParams.id).success(function(res) {
        $scope.todo = res || {};
        $scope.loadComments();
    }).error(function() {
        console.log("error");
    });

    $scope.save = function() {
        $scope.todo.user = $rootScope.loggedInUser.id;

        sync.post('/projects/' + $rootScope.project_id + '/todos', $scope.todo).success(function(r) {
            console.log("done");
            $scope.todo = {};
            $location.path("/dashboard");
        }).error(function() {
            console.log("error");
        });
    };

    $scope.loadComments = function() {
        if ($scope.todo) {
            sync.get('/todos/' + $scope.todo.id + '/comments').success(function(res) {
                $scope.comments = res || [];
            }).error(function() {
                console.log("error");
            });
        }
    };

    $scope.addComment = function() {
        sync.post('/todos/' + $scope.todo.id + '/comments', {
            details: $scope.comment.details,
            user: { id: $rootScope.loggedInUser.id, name: $rootScope.loggedInUser.name },
            project_id: $rootScope.project_id,
            project_name: $rootScope.project_name,
            note_title: $scope.todo.title
        }).success(function(o){
            console.log("saved");
            $scope.loadComments();
            $scope.comment = {};
        });
    }

  });
