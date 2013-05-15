'use strict';

angular.module('webApp')
  .controller('ProjectsCtrl', function ($rootScope, $scope, sync, $location) {
    $scope.addProject = function() {
        sync.post('/projects', { 
            name: $scope.project.name, 
            description: $scope.project.description,
            created_by: $rootScope.loggedInUser.id
        }).success(function() {
            console.log("done");
            $location.path("/");
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
            user: { name: $scope.member.name }
        };
        sync.post('/projects/' + $rootScope.project_id + '/members', member).success(function() {
            $scope.members.push(member);
            $scope.member = { };
            if ($scope.roles.length > 0) $scope.member.role = $scope.roles[0];
        }).error(function() {
            console.log("error");
        });
    };
  });
