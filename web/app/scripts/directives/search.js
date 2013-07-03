'use strict';

angular.module('webApp')
  .directive('search', function ($rootScope, sync) {
  return {
        restrict: 'E', //element only
        templateUrl: 'views/search.html',
        link: function($scope, element, attrs) {

            var lookup = function() {
                if (!$scope.searchKeyword || $scope.searchKeyword.length < 3) return;

                if ($rootScope.project_id) {
                    sync.get('/projects/' + $rootScope.project_id + '/search/' + $scope.searchKeyword).success(function(res){
                        $scope.searchResults = res || [];
                    }).error(function(e){
                       console.log(e);
                    });
                }
            }

            $scope.$watch('searchKeyword', lookup);
        }
    }
  });
