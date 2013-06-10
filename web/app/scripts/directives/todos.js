'use strict';

angular.module('webApp')
  .directive('todos', function ($rootScope, sync) {
  return {
        restrict: 'E', //element only
        templateUrl: 'views/todos/form.html',
        scope: {},
        link: function(scope, element, attrs) {

            scope.addTodo = function() {
                scope.todo.owner_id = scope.todo.owner ? scope.todo.owner.id : null;
                sync.post('/projects/' + $rootScope.project_id + '/todos', scope.todo).success(function(r) {
                    scope.todo = { user: $rootScope.loggedInUser.id, status: "Pending" };
                }).error(function() {
                    console.log("error");
                });
            };

            scope.config = { todos: {} };
            scope.config.todos.statuses = ['Pending', 'Done'];
            $rootScope.$watch('project_id', function() {
                if ($rootScope.project_id) {
                    sync.get("/projects/" + $rootScope.project_id + "/members").success(function(res){
                        var owners = res || [];
                        scope.config.todos.owners = _.map(owners, function(o){
                            return o.user;
                        });
                    }).error(function(error){
                        console.log(error);
                    });
                }
            });
        }
    }
  });
