'use strict';

angular.module('webApp')
  .controller('HomeCtrl', function ($rootScope, $scope, sync, $location) {
    $scope.projects = [];

    $scope.projectNames = {};
    $rootScope.userProjects = [];

    sync.get("/users/"+ $rootScope.loggedInUser.id + "/projects").success(function(res){
        $rootScope.userProjects = [];
        var projects = [];
        if (res) {
            _.each(res, function(o){
                projects.push(o.project);
                $rootScope.userProjects.push(o.project.id);
            });
        }
        $scope.projects = projects;
        if (res && res.length > 0) {
            $rootScope.project_id = res[0].project.id;
            $rootScope.project_name = res[0].project.name;
            res.forEach(function(p){
                $scope.projectNames[p.project.id] = p.project.name;
            });

            loadMembers();
        }
    }).error(function(error){
        console.log(error);
    });

    var loadMembers = function() {
        sync.get("/projects/" + $rootScope.project_id + "/members").success(function(res){
            var owners = res || [];
            $rootScope.appconfig.project_members = _.map(owners, function(o){
                return o.user;
            });
        }).error(function(error){
            console.log(error);
        });
    }

    $scope.select = function(id) {
        $rootScope.project_id = id;
        $rootScope.project_name = $scope.projectNames[id];
        loadMembers();
        $location.path('dashboard');
    };

    $scope.edit = function(id) {
        $scope.select(id);
        $location.path('projects/edit');
    }

  });
