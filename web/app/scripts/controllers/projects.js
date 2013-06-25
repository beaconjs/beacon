'use strict';

angular.module('webApp')
  .controller('ProjectsCtrl', function ($rootScope, $scope, sync, $location) {
    $scope.addProject = function() {
        sync.post('/projects', {
            name: $scope.project.name,
            description: $scope.project.description,
            created_by: $rootScope.loggedInUser.id
        }).success(function(r) {
            $rootScope.project_id = r.project.id;
            $rootScope.project_name = r.project.name;
            $rootScope.userProjects = $rootScope.userProjects.concat(r.project.id);
            console.log("done");
            $location.path("/projects/edit");
        }).error(function() {
            console.log("error");
        });
    };
  });

angular.module('webApp')
  .controller('EditProjectsCtrl', function ($rootScope, $scope, sync, $location) {

    $scope.members = [];
    $scope.sprints = [];
    $scope.lanes = [];
    $scope.member = { };
    $scope.roles = [];
    $scope.searchResults = [];

    $scope.$watch('member.name', function() {
        if ($scope.member && $scope.member.name && $scope.member.name.length > 2 && !$scope.member.user_id) {
            sync.get('/users/search/' + $scope.member.name , {}).success(function(res) {
                $scope.searchResults = res || [];
            }).error(function() {
                console.log("error");
            });
        }
    });

    sync.get('/roles', {}).success(function(res) {
        $scope.roles = res || [];
        if ($scope.roles.length > 0) $scope.member.role = $scope.roles[0];
    }).error(function() {
        console.log("error");
    });

    $scope.selectUser = function(id, name) {
        $scope.member.name = name;
        $scope.member.user_id = id;
        $scope.searchResults = [];
    }

    var get = function(path, arr) {
        sync.get('/projects/' + $rootScope.project_id + path, {}).success(function(res) { $scope[arr] = res || []; }).error(function() {
            console.log("error");
        });
    }

    get('/members', 'members');
    get('/sprints', 'sprints');
    get('/lanes', 'lanes');

    $scope.addMember = function() {
        var member = {
            role_id: $scope.member.role.id,
            user_id: $scope.member.user_id,
            user: { name: $scope.member.name },
            project_name: $rootScope.project_name,
            issuer: { id: $rootScope.loggedInUser.id, name: $rootScope.loggedInUser.name }
        };
        sync.post('/projects/' + $rootScope.project_id + '/members', member).success(function() {
            $scope.member = { };
            if ($scope.roles.length > 0) $scope.member.role = $scope.roles[0];
            get('/members', 'members');
        }).error(function() {
            console.log("error");
        });
    };

    var addNotificationFields = function(obj) {
        obj.project_name = $rootScope.project_name;
        obj.issuer = { id: $rootScope.loggedInUser.id, name: $rootScope.loggedInUser.name };
    }

    $scope.addSprint = function() {
        $scope.sprint.user_id = $rootScope.loggedInUser.id;
        addNotificationFields($scope.sprint);
        sync.post('/projects/' + $rootScope.project_id + '/sprints', $scope.sprint).success(function() {
            $scope.sprint = { };
            get('/sprints', 'sprints');
        }).error(function() {
            console.log("error");
        });
    };

    $scope.addLane = function() {
        addNotificationFields($scope.lane);
        $scope.lane.position = $scope.lanes.length + 1;
        sync.post('/projects/' + $rootScope.project_id + '/lanes', $scope.lane).success(function() {
            $scope.lane = { };
            get('/lanes', 'lanes');
        }).error(function() {
            console.log("error");
        });
    };
  });
