'use strict';

angular.module('webApp')
  .controller('ReportsCtrl', function ($rootScope, $scope, $location, sync) {

    sync.get('/projects/' + $rootScope.project_id + '/progress').success(function(res) {
        $scope.reportData = res;
        $scope.totalPoints = _.reduce(res.total, function(memo, sprint){ return memo + sprint.points; }, 0);
        $scope.burnDown = _.map(res.completed, function(o, sprintId) { return { sprint: sprintId, points: ($scope.totalPoints - o.points) } });
    });
    

  });
