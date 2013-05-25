'use strict';

angular.module('webApp')
  .controller('TodosCtrl', function ($rootScope, $scope, sync, $location) {

    $scope.todo = { user: $rootScope.loggedInUser.id };

    var loadTodos = function() {
        sync.get('/projects/' + $rootScope.project_id + '/todos').success(function(res) {
            $scope.todos = res || {};
        }).error(function() {
            console.log("error");
        });
    }

    loadTodos();

    $scope.add = function() {
        sync.post('/projects/' + $rootScope.project_id + '/todos', $scope.todo).success(function(r) {
            $scope.todo = { user: $rootScope.loggedInUser.id };
            loadTodos();
        }).error(function() {
            console.log("error");
        });
    };

    $scope.load = function(id) {
        $location.path("/todos/" + id)
    }
  });

angular.module('webApp')
  .controller('EditTodosCtrl', function ($rootScope, $scope, sync, $location, $routeParams) {

    $scope.todo = {};

    sync.get('/projects/' + $rootScope.project_id + '/todos/' + $routeParams.id).success(function(res) {
        $scope.todo = res || {};
    }).error(function() {
        console.log("error");
    });

    $scope.save = function() {
        $scope.todo.user = $rootScope.loggedInUser.id;

        sync.post('/projects/' + $rootScope.project_id + '/todos', $scope.todo).success(function(r) {
            console.log("done");
            $scope.todo = {};
            $location.path("/todos");
        }).error(function() {
            console.log("error");
        });
    };

  });
