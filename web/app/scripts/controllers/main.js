'use strict';

angular.module('webApp')
  .controller('MainCtrl', function ($rootScope, $location) {
    $rootScope.gotoPage = function(path) {
        $location.path(path);
    }
  });
