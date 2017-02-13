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
      templateUrl : '/app/views/home.html',
      controller  : 'homeController'
    })
    .when('/about', {
      templateUrl : '/app/views/about.html',
      controller  : 'aboutController'
    })
    .when('/contact', {
      templateUrl : '/app/views/contact.html',
      controller  : 'contactController'
    })
    .when('/todo', {
      templateUrl : '/app/views/todo.html',
      controller  : 'todoController'
    })
    .otherwise({redirectTo: '/'});
  $locationProvider.html5Mode(true);
}]);
