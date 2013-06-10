'use strict';

var webApp = angular.module('webApp', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'HomeCtrl'
      }).when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      }).when('/plan', {
        templateUrl: 'views/wall.html',
        controller: 'PlanCtrl'
      }).when('/backlog', {
        templateUrl: 'views/backlog.html',
        controller: 'BacklogCtrl'
      }).when('/notes', {
        templateUrl: 'views/notes/index.html',
        controller: 'NotesCtrl'
      }).when('/projects/new', {
        templateUrl: 'views/projects/add.html',
        controller: 'ProjectsCtrl'
      }).when('/projects/edit', {
        templateUrl: 'views/projects/edit.html',
        controller: 'EditProjectsCtrl'
      }).when('/todos/:id', {
        templateUrl: 'views/todos/edit.html',
        controller: 'TodosCtrl'
      }).when('/bugs/:id', {
        templateUrl: 'views/bugs/edit.html',
        controller: 'BugsCtrl'
      }).when('/report', {
        templateUrl: 'views/report.html',
        controller: 'ReportsCtrl'
      }).when('/dashboard', {
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl'
      }).otherwise({
        redirectTo: '/'
      });
  });

webApp.run(function ($rootScope, $location) {

  var isLoginPage = function (page) {
    return page.templateUrl === "views/login.html";
  };

  // register listener to watch route changes
  $rootScope.$on("$routeChangeStart", function (event, next, current) {
    if (!$rootScope.loggedInUser) {
      // no logged user, we should be going to #login
      if (isLoginPage(next)) {
        // already going to #login, no redirect needed
      } else {
        // not going to #login, we should redirect now
        $location.path("/login");
      }
    }

    if ($rootScope.lastActivityTime && !isLoginPage(next) && !isLoginPage(current)) {
      // no session check needed if going to or coming from login page
      var span = moment().diff($rootScope.lastActivityTime, 'minutes');
      if (span > 30) {
        // session timeout after 30 minutes of inactivity
        $rootScope.loggedInUser = null;
        $location.path("/login");
      } else {
        $rootScope.lastActivityTime = moment();
      }
    } else {
      $rootScope.lastActivityTime = moment();
    }
  });
});
