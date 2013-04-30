'use strict';

angular.module('webApp')
  .controller('NotesCtrl', function ($rootScope, $scope, $http) {
    $scope.note_id = null;

    $scope.$watch('notedetails', function(){
        $http.post($rootScope.appconfig.server + '/notes', {
            id: $scope.note_id,
            title: $scope.notetitle,
            details: $('#notedetails').val(),
            project: $rootScope.project_id,
            user: $rootScope.loggedInUser.id
        }).success(function(o){
            if (o.id) $scope.note_id = o.id;
        });
    });
  });
