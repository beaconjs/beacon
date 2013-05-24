'use strict';

angular.module('webApp')
  .controller('DashboardCtrl', function ($rootScope, $scope, sync, $location) {

    $scope.allStories = [];
    $scope.stories = [];
    $scope.owner = [];
    $scope.status = [];
    $scope.sprint = [];
    $scope.owners = [];
    $scope.statuses = [];
    $scope.sprints = [];

    var isValid = function(arr, value) {
        var match = true;

        if ($scope[arr] && $scope[arr].length > 0 && $scope[arr].indexOf(value) === -1 ) match = false;
        return match;
    }

    var applyFilters = function() {
        $scope.stories = [];
        _.each($scope.allStories, function(o){
            var match = true;
            if (match && !isValid('owner', o.owner_id)) match = false;
            if (match && !isValid('status', o.status)) match = false;
            if (match && !isValid('sprint', o.sprint_id)) match = false;

            if(match) $scope.stories.push(o);
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

    $scope.sprintFilter = function(s) {
        addFilter("sprint", s);
    }

    sync.get("/projects/" + $rootScope.project_id + "/stories").success(function(res){
        $scope.allStories = res || [];
        $scope.owner = [$rootScope.loggedInUser.id];
        $scope.status = ['not_started'];
        applyFilters();
    }).error(function(error){
        console.log(error);
    });

    sync.get("/projects/" + $rootScope.project_id + "/lanes").success(function(res){
        var lanes = res || [];
        $scope.statuses = _.map(lanes, function(o){
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

    $("th a").click( function(event) {
      $(".story-filter").css( {position:"absolute", top:(event.pageY + 10), left: (event.pageX + 10)});
    });

  });
