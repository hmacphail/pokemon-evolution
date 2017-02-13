// require all of the core libraries
require('./vendors/angular.min');
require('./vendors/angular-route.min');

// pull in modules
require('./controllers/controllers');
require('./services/services');

var app = angular.module('pokelution', ['controllers', 'services', 'ngRoute']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl : '/views/home.html',
      controller  : 'homeController'
    })
    .when('/404', {
      templateUrl : '/views/error.html',
      controller  : 'errorController'
    })
    .when('/admin', {
      templateUrl : '/views/admin.html',
      controller  : 'adminController'
    })
    .when('/todo', {
      templateUrl : '/views/todo.html',
      controller  : 'todoController'
    })
    .otherwise({redirectTo: '/404'});
  $locationProvider.html5Mode(true);
}]);
