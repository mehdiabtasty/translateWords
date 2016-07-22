'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', [
    'firebase',
    'ui.materialize',
    'myApp.config',
    'myApp.security',
    'myApp.home',
    'myApp.dashboard',
    'myApp.account',
    'myApp.chat',
    'myApp.login'
  ])
  
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.otherwise({
      redirectTo: '/dashboard'
    });
  }])
  
  .run(['$rootScope', 'Auth', function($rootScope, Auth) {
    // track status of authentication
    Auth.$onAuthStateChanged(function(user) {
      $rootScope.loggedIn = !!user;
    });
  }]);
