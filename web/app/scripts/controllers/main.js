'use strict';

angular.module('webApp')
  .controller('MainCtrl', function ($rootScope, $location, $http) {
    $rootScope.gotoPage = function(path) {
        $location.path(path);
    }

    $http.get('scripts/config.json').success(function(data) {
        $rootScope.appconfig = data;
    });
  });
