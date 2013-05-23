'use strict';

angular.module('webApp').factory('charts', function ($rootScope, $http, $location) {
    var h = Math.floor($("#page").height() * 0.45);
    var w = Math.floor($("#page").width() * 0.45);

    var addChart = function(type, id, title, data, xAxisLabel, yAxisLabel) {
        nv.addGraph(function() {  
         var chart = null;
         if (type === "line") {
            chart = nv.models.lineChart().width(w).height(h);
         } else {
            // assume a bar chart
            chart = nv.models.multiBarChart().width(w).height(h);
         }
         
         chart.xAxis
             .axisLabel(xAxisLabel);
         chart.yAxis
             .axisLabel(yAxisLabel)
             .tickFormat(d3.format('d'));
         d3.select(id + ' svg')
             .datum(data)
           .transition().duration(500)
             .call(chart);
         nv.utils.windowResize(function() { d3.select(id + ' svg').call(chart) });
         d3.select(id + ' svg')
          .append("text")
          .attr("x", Math.floor(w/2))
          .attr("y", 10)
          .attr("text-anchor", "middle")
          .attr("fill", "gray")
          .text(title);

         return chart;
       });
    };

    var _line = function(id, title, data, xAxisLabel, yAxisLabel) {
        addChart("line", id, title, data, xAxisLabel, yAxisLabel);
    }

    var _bar = function(id, title, data, xAxisLabel, yAxisLabel) {
        addChart("bar", id, title, data, xAxisLabel, yAxisLabel);
    }

    //Public APIs
    return {
        line: _line,
        bar: _bar
    };
});