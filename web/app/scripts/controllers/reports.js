'use strict';

angular.module('webApp')
  .controller('ReportsCtrl', function ($rootScope, $scope, $location, sync, charts) {

    sync.get('/projects/' + $rootScope.project_id + '/progress').success(function(res) {
        if (!res || jQuery.isEmptyObject(res.total)) return;

        $scope.reportData = res;
        $scope.totalPoints = _.reduce(res.total, function(memo, sprint){ return memo + sprint.points; }, 0);
        $scope.pendingPoints = $scope.totalPoints;

        var i = 0;
        var j = 0;
        $scope.burnDown = _.map(res.completed, function(o, sprintId) { $scope.pendingPoints -= o.points; return { x: (++i), y: $scope.pendingPoints, sprintId: sprintId } });
        $scope.burnDown.splice(0,0, {x: 0, y: $scope.totalPoints});

        $scope.velocityTrend = _.map(res.completed, function(o, sprintId) { return { x: (++j), y: o.points } });
        $scope.velocityTrend.splice(0,0, {x: 0, y: 0});

        $scope.projection = [];

        var remainingPoints = $scope.burnDown[$scope.burnDown.length - 1].y;
        var lastSprintId = $scope.burnDown[$scope.burnDown.length - 1].sprintId;
        var lastSprintVelocity = res.completed[lastSprintId].points;

        $scope.projection.push({ x: i, y: remainingPoints});
        while (remainingPoints > 0) {
            remainingPoints = remainingPoints - lastSprintVelocity;
            if (remainingPoints < 0) remainingPoints = 0;
            $scope.projection.push({ x: ++i, y: remainingPoints});
        }

         var totalData = [];
         var completedData = [];
         var i = 0;
         _.each(res.total, function(o, sprintId){
            var sprint = (sprintId === "none") ? "Not Planned" : ("Sprint " + i++);
            totalData.push({x: sprint, y: o.points || 0 });
            var completed = res.completed[sprintId] || {};
            completedData.push({x: sprint, y: completed.points || 0 });
         });

        charts.line("#burndown_chart", "Effort Burndown", [
                     {values: $scope.burnDown, key: 'Trend', color: '#2ca02c'}, 
                     {values: $scope.projection, key: 'Expected', color: '#ff7f0e'}
                    ], 'Sprint', 'Points');

        charts.line("#velocity_chart", "Velocity Trend", [
                     {values: $scope.velocityTrend, key: 'Trend', color: '#2ca02c'} 
                    ], 'Sprint', 'Points', true);

        charts.bar("#trend_chart", "Planned Vs Completed", [
                     {values: totalData, key: 'Planned', color: '#1F77B4'}, 
                     {values: completedData, key: 'Completed', color: '#2ca02c'}
                    ], 'Sprint', 'Points');
    });

  });
