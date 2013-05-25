'use strict';

angular.module('webApp')
  .controller('BugsCtrl', function ($rootScope, $scope, sync, $location) {

    $scope.allBugs = [];
    $scope.bug = { user: $rootScope.loggedInUser.id };
    $scope.owners = [];
    $scope.statuses = ['New', 'Open', 'Fixed', 'Released', 'Invalid', 'Closed'];
    $scope.priorities = ['High', 'Medium', 'Low', 'Trivial'];
    $scope.owner = [];
    $scope.status = [];
    $scope.priority = [];

    var applyFilters = function() {
        $scope.bugs = [];
        _.each($scope.allBugs, function(o){
            var match = true;
            if (match && !isValid('owner', o.owner_id)) match = false;
            if (match && !isValid('status', o.status)) match = false;
            if (match && !isValid('priority', o.priority)) match = false;

            if(match) $scope.bugs.push(o);
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

    $scope.priorityFilter = function(s) {
        addFilter("priority", s);
    }

    sync.get("/projects/" + $rootScope.project_id + "/members").success(function(res){
        var owners = res || [];
        $scope.owners = _.map(owners, function(o){
            return o.user;
        });
    }).error(function(error){
        console.log(error);
    });

    var loadBugs = function() {
        sync.get('/projects/' + $rootScope.project_id + '/bugs').success(function(res) {
            $scope.bugs = res || {};
            $scope.allBugs = $scope.bugs;
        }).error(function() {
            console.log("error");
        });
    }

    loadBugs();

    $scope.add = function() {
        sync.post('/projects/' + $rootScope.project_id + '/bugs', $scope.bug).success(function(res) {
            $scope.bug = { user: $rootScope.loggedInUser.id };
            loadBugs();
        }).error(function() {
            console.log("error");
        });
    };

    $scope.load = function(id) {
        $location.path("/bugs/" + id)
    }
  });

angular.module('webApp')
  .controller('EditBugsCtrl', function ($rootScope, $scope, sync, $location, $routeParams) {

    $scope.bug = {};

    sync.get('/projects/' + $rootScope.project_id + '/bugs/' + $routeParams.id).success(function(res) {
        $scope.bug = res || {};
    }).error(function() {
        console.log("error");
    });

    $scope.save = function() {
        $scope.bug.user = $rootScope.loggedInUser.id;
        
        sync.post('/projects/' + $rootScope.project_id + '/bugs', $scope.bug).success(function(res) {
            console.log("done");
            $scope.bug = {};
            $location.path("/bugs");
        }).error(function() {
            console.log("error");
        });
    };

  });
