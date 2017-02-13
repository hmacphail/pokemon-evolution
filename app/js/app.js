// require all of the core libraries
require('./vendors/angular.min');
require('./vendors/angular-route.min');

// pull in modules
require('./controllers/controllers');
require('./services/services');

var app = angular.module('pokelution', ['controllers', 'services', 'ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl : '/views/home.html',
      controller  : 'homeController'
    })
    .when('/about', {
      templateUrl : '/views/about.html',
      controller  : 'aboutController'
    })
    .when('/contact', {
      templateUrl : '/views/contact.html',
      controller  : 'contactController'
    })
    .when('/todo', {
      templateUrl : '/views/todo.html',
      controller  : 'todoController'
    })
    .otherwise({redirectTo: '/'});
}]);
