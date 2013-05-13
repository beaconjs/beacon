'use strict';

angular.module('webApp')
  .controller('ProjectsCtrl', function ($rootScope, $scope, $http, $location) {
    $scope.addProject = function() {
        $http.post($rootScope.appconfig.server + '/projects', { 
            name: $scope.project.name, 
            description: $scope.project.description 
        }).success(function() {
            console.log("done");
            $location.path("/");
        }).error(function() {
            console.log("error");
        });
    };
  });

angular.module('webApp')
  .controller('EditProjectsCtrl', function ($rootScope, $scope, $http, $location) {

    $scope.members = [];
    $scope.member = { };
    $scope.roles = [];
    $scope.searchResults = [];

    $scope.$watch('member.name', function() {
        if ($scope.member && $scope.member.name && $scope.member.name.length > 2 && !$scope.member.user_id) {
            $http.get($rootScope.appconfig.server + '/users/search/' + $scope.member.name , {}).success(function(res) {
                $scope.searchResults = res || [];
            }).error(function() {
                console.log("error");
            });
        } 
    });

    $http.get($rootScope.appconfig.server + '/roles', {}).success(function(res) {
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

    $http.get($rootScope.appconfig.server + '/projects/' + $rootScope.project_id + '/members', {}).success(function(res) {
        $scope.members = res || [];
    }).error(function() {
        console.log("error");
    });

    $scope.addMember = function() {
        var member = { 
            role_id: $scope.member.role.id, 
            user_id: $scope.member.user_id,
            user: { name: $scope.member.name }
        };
        $http.post($rootScope.appconfig.server + '/projects/' + $rootScope.project_id + '/members', member).success(function() {
            $scope.members.push(member);
            $scope.member = { };
            if ($scope.roles.length > 0) $scope.member.role = $scope.roles[0];
        }).error(function() {
            console.log("error");
        });
    };
  });
