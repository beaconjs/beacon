'use strict';

angular.module('webApp')
  .directive('todos', function ($rootScope, sync) {
  return {
        restrict: 'E', //element only
        templateUrl: 'views/todos/form.html',
        link: function(scope, element, attrs) {

            scope.addTodo = function() {
                scope.todo.owner_id = scope.todo.owner ? scope.todo.owner.id : null;
                sync.post('/projects/' + $rootScope.project_id + '/todos', scope.todo).success(function(r) {
                    scope.todo = { user: $rootScope.loggedInUser.id, status: "Pending" };
                }).error(function() {
                    console.log("error");
                });
            };

            scope.config = scope.config || { todos: {} };
            scope.config.todos = $rootScope.appconfig.todos;
            scope.config.todos.owners = $rootScope.appconfig.project_members;
            $rootScope.$watch("appconfig.project_members", function(){
                scope.config.todos.owners = $rootScope.appconfig.project_members;
            });
        }
    }
  });
