'use strict';

angular.module('webApp')
  .controller('TodosCtrl', function ($rootScope, $scope, sync, $location) {

    $scope.allTodos = [];
    $scope.todo = { user: $rootScope.loggedInUser.id };
    $scope.owners = [];
    $scope.statuses = ['Pending', 'Done'];
    $scope.owner = [];
    $scope.status = [];

    $scope.toggle = function(todo) {
        todo.status = (todo.status === "Done") ? "Pending" : "Done";
    }

    var applyFilters = function() {
        $scope.todos = [];
        _.each($scope.allTodos, function(o){
            var match = true;
            if (match && !isValid('owner', o.owner_id)) match = false;
            if (match && !isValid('status', o.status)) match = false;

            if(match) $scope.todos.push(o);
        });
    }

    var addFilter = function(filter, s) {
        if ($scope[filter].indexOf(s) !== -1) {
            var index = $scope[filter].indexOf(s);
            $scope[filter].splice(index, 1);
        } else {
            $scope[filter].push(s);
        }
        applyFilters();
    }

    $scope.statusFilter = function(s) {
        addFilter("status", s);
    }

    $scope.ownerFilter = function(s) {
        addFilter("owner", s);
    }

    sync.get("/projects/" + $rootScope.project_id + "/members").success(function(res){
        var owners = res || [];
        $scope.owners = _.map(owners, function(o){
            return o.user;
        });
    }).error(function(error){
        console.log(error);
    });

    var loadTodos = function() {
        sync.get('/projects/' + $rootScope.project_id + '/todos').success(function(res) {
            $scope.todos = res || {};
            $scope.allTodos = $scope.todos;
        }).error(function() {
            console.log("error");
        });
    }

    loadTodos();

    $scope.add = function() {
        $scope.todo.owner_id = $scope.todo.owner ? $scope.todo.owner.id : null;
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
