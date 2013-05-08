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

    $http.get($rootScope.appconfig.server + '/projects/' + $rootScope.project_id + '/members', {}).success(function(res) {
        $scope.members = res || [];
        console.log(res);
    }).error(function() {
        console.log("error");
    });

    $scope.addMember = function() {
        var member = { 
            role_id: $scope.member.role_id, 
            user_id: $scope.member.user_id 
        };
        $http.post($rootScope.appconfig.server + '/projects/' + $rootScope.project_id + '/members', member).success(function() {
            $scope.members.push(member);
        }).error(function() {
            console.log("error");
        });
    };
  });
