'use strict';

angular.module('webApp')
  .controller('DashboardCtrl', function ($rootScope, $scope, sync, $location) {

    $scope.all = { stories: [], bugs: [], todos: [] };
    $scope.stories = [];
    $scope.owner = [];
    $scope.status = [];
    $scope.sprint = [];
    $scope.priority = [];
    $scope.owners = [];
    $scope.sprints = [];
    $scope.todo = { user: $rootScope.loggedInUser.id };
    $scope.bug = { user: $rootScope.loggedInUser.id };
    $scope.config = { bugs: {}, stories: {}, todos: {}};

    $scope.config.stories.statuses = [];
    $scope.config.bugs.statuses = ['New', 'Open', 'Fixed', 'Released', 'Invalid', 'Closed'];
    $scope.config.bugs.priorities = ['High', 'Medium', 'Low', 'Trivial'];
    $scope.config.todos.statuses = ['Pending', 'Done'];

    $scope.invert = false;

    $scope.context='stories';

    $scope.$watch('context', function() {
        $scope.owner = [];
        $scope.status = [];
        $scope.sprint = [];
        $scope.priority = [];
        $scope.invert = false;
    });

    $scope.$watch('invert', applyFilters);

    $scope.getCss = function(todo) {
        var css = "";
        css += ((todo.status === "Done")? "done" : "");
        if (todo.due_date && moment(todo.due_date).isBefore(moment()) && todo.status !== "Done") {
            css += "overdue";
        }
        return css;
    }

    $scope.toggle = function(todo) {
        todo.status = (todo.status === "Done") ? "Pending" : "Done";
        sync.post('/projects/' + $rootScope.project_id + '/todos', todo).success(function(r) {
        }).error(function() {
            console.log("error");
        });
    }

    $scope.invertFilter = function() {
        $scope.invert = !$scope.invert;
        applyFilters();
    }

    var isValid = function(arr, value) {
        var match = true;

        if ($scope[arr] && $scope[arr].length > 0 && $scope[arr].indexOf(value) === -1 ) match = false;
        return (!$scope.invert && match) || ($scope.invert && !match);
    }

    var applyFilters = function() {
        $scope[$scope.context] = [];
        _.each($scope.all[$scope.context], function(o){
            var match = true;
            if (match && !isValid('owner', o.owner_id)) match = false;
            if (match && !isValid('status', o.status)) match = false;
            if (match && $scope.context === "stories" && !isValid('sprint', o.sprint_id)) match = false;
            if (match && $scope.context === "bugs" && !isValid('priority', o.priority)) match = false;

            if(match) $scope[$scope.context].push(o);
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

    $scope.priorityFilter = function(s) {
        addFilter("priority", s);
    }

    $scope.ownerFilter = function(s) {
        addFilter("owner", s);
    }

    $scope.sprintFilter = function(s) {
        addFilter("sprint", s);
    }

    sync.get("/projects/" + $rootScope.project_id + "/stories").success(function(res){
        $scope.all.stories = res || [];
        $scope.owner = [$rootScope.loggedInUser.id];
        $scope.status = ['not_started'];
        applyFilters();
    }).error(function(error){
        console.log(error);
    });

    sync.get("/projects/" + $rootScope.project_id + "/lanes").success(function(res){
        var lanes = res || [];
        $scope.config.stories.statuses = _.map(lanes, function(o){
            return o.status;
        });
    }).error(function(error){
        console.log(error);
    });

    sync.get("/projects/" + $rootScope.project_id + "/sprints").success(function(res){
        $scope.sprints = res || [];
    }).error(function(error){
        console.log(error);
    });

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
            $scope.all.todos = $scope.todos;
        }).error(function() {
            console.log("error");
        });
    }

    loadTodos();

    $scope.addTodo = function() {
        $scope.todo.owner_id = $scope.todo.owner ? $scope.todo.owner.id : null;
        sync.post('/projects/' + $rootScope.project_id + '/todos', $scope.todo).success(function(r) {
            $scope.todo = { user: $rootScope.loggedInUser.id };
            loadTodos();
        }).error(function() {
            console.log("error");
        });
    };

    $scope.getTodo = function(id) {
        $location.path("/todos/" + id)
    }

    var loadBugs = function() {
        sync.get('/projects/' + $rootScope.project_id + '/bugs').success(function(res) {
            $scope.bugs = res || {};
            $scope.all.bugs = $scope.bugs;
        }).error(function() {
            console.log("error");
        });
    }

    loadBugs();

    $scope.addBug = function() {
        sync.post('/projects/' + $rootScope.project_id + '/bugs', $scope.bug).success(function(res) {
            $scope.bug = { user: $rootScope.loggedInUser.id };
            loadBugs();
        }).error(function() {
            console.log("error");
        });
    };

    $scope.getBug = function(id) {
        $location.path("/bugs/" + id)
    }

    $("th a").click( function(event) {
      $(".story-filter").css( {position:"absolute", top:(event.pageY + 10), left: (event.pageX - 50)});
    });

  });
