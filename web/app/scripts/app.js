'use strict';

angular.module('webApp', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'HomeCtrl'
      }).when('/plan', {
        templateUrl: 'views/wall.html',
        controller: 'PlanCtrl'
      }).when('/notes', {
        templateUrl: 'views/notes/index.html',
        controller: 'NotesCtrl'
      }).when('/chat', {
        templateUrl: 'views/chat.html',
        controller: 'NotesCtrl'
      }).when('/projects/new', {
        templateUrl: 'views/projects/add.html',
        controller: 'ProjectsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
