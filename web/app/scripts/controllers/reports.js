'use strict';

angular.module('webApp')
  .controller('ReportsCtrl', function ($rootScope, $scope, $location, sync) {

    sync.get('/projects/' + $rootScope.project_id + '/progress').success(function(res) {
        $scope.reportData = res;
        $scope.totalPoints = _.reduce(res.total, function(memo, sprint){ return memo + sprint.points; }, 0);
        $scope.pendingPoints = $scope.totalPoints;
        var i = 0;
        $scope.burnDown = _.map(res.completed, function(o, sprintId) { $scope.pendingPoints -= o.points; return { x: (++i), y: $scope.pendingPoints, sprintId: sprintId } });
        $scope.burnDown.splice(0,0, {x: 0, y: $scope.totalPoints});

        $scope.projection = [];

        var remainingPoints = $scope.burnDown[$scope.burnDown.length - 1].y;
        var lastSprintId = $scope.burnDown[$scope.burnDown.length - 1].sprintId;
        var lastSprintVelocity = res.completed[lastSprintId].points;

        $scope.projection.push({ x: i, y: remainingPoints});
        while (remainingPoints > 0) {
            remainingPoints = remainingPoints - lastSprintVelocity;
            $scope.projection.push({ x: ++i, y: remainingPoints});
        }

        nv.addGraph(function() {  
         var chart = nv.models.lineChart();
         chart.xAxis
             .axisLabel('Sprint')
             .tickFormat(d3.format('d'));
         chart.yAxis
             .axisLabel('Points')
             .tickFormat(d3.format('d'));
         d3.select('#burndown_chart svg')
             .datum([
                     {values: $scope.burnDown, key: 'Trend', color: '#ff7f0e'}, 
                     {values: $scope.projection, key: 'Expected', color: '#2ca02c'}
                    ])
           .transition().duration(500)
             .call(chart);
         nv.utils.windowResize(function() { d3.select('#burndown_chart svg').call(chart) });
         return chart;
       });


       nv.addGraph(function() {  
         var chart = nv.models.multiBarChart()
         .x(function(d) { return d.label })
         .y(function(d) { return d.value });

         chart.xAxis
             .axisLabel('Sprint');
         chart.yAxis
             .axisLabel('Points')
             .tickFormat(d3.format('d'));

         var totalData = [];
         var completedData = [];
         var i = 0;
         _.each(res.total, function(o, sprintId){
            var sprint = (sprintId === "none") ? "Not Planned" : ("Sprint " + i++);
            totalData.push({label: sprint, value: o.points || 0 });
            var completed = res.completed[sprintId] || {};
            completedData.push({label: sprint, value: completed.points || 0 });
         });

         d3.select('#trend_chart svg')
             .datum([
                     {values: totalData, key: 'Planned', color: '#1F77B4'}, 
                     {values: completedData, key: 'Completed', color: '#2ca02c'}
                    ])
           .transition().duration(500)
             .call(chart);
         nv.utils.windowResize(function() { d3.select('#trend_chart svg').call(chart) });
         return chart;
       });

    });

  });
