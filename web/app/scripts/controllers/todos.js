'use strict';

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
            $location.path("/dashboard");
        }).error(function() {
            console.log("error");
        });
    };

  });
