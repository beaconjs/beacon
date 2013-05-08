'use strict';

angular.module('webApp')
  .controller('NotesCtrl', function ($rootScope, $scope, $http) {
    $scope.note_id = null;
    $scope.notes = [];

    $http.get($rootScope.appconfig.server + "/projects/" + $rootScope.project_id + "/notes").success(function(res){
        $scope.notes = res;
    }).error(function(error){
        console.log(error);
    });

    function isBlank(str) {
        return (!str || /^\s*$/.test(str));
    }

    $scope.$watch('notedetails', function(){
        if ((!$scope.note_id && !isBlank($scope.notedetails)) || $scope.note_id) {
            $http.post($rootScope.appconfig.server + '/notes', {
                id: $scope.note_id,
                title: $scope.notetitle,
                details: $('#notedetails').val(),
                project: $rootScope.project_id,
                user: $rootScope.loggedInUser.id
            }).success(function(o){
                if (o.id) $scope.note_id = o.id;
            });
        }
    });

    $scope.load = function(id) {
        $http.get($rootScope.appconfig.server + '/projects/' + $rootScope.project_id + '/notes/' + id, {}).success(function(res) {
            $scope.note_id = id;
            if (res) {
                $('#notedetails_div').html(res.details);
                $scope.notetitle = res.title;
                $('#notedetails').val(res.details);
            }
        }).error(function() {
            console.log("error");
        });
    }
  });
