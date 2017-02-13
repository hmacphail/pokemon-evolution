// require all of the core libraries
require('./vendors/angular.min');
require('./vendors/angular-route.min');

// pull in the modules we are going to need (controllers, services, whatever)
var homeController = require('./controllers/homeController');
var aboutController = require('./controllers/aboutController');
var contactController = require('./controllers/contactController');
var todoController = require('./controllers/todoController');

var todoService = require('./services/todoService');

// module up
var app = angular.module('pokelution', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
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

}]);

// create factories
app.factory('Generations', ['$http', todoService]);

// create controllers
app.controller('homeController', ['$scope', homeController]);
app.controller('aboutController', ['$scope', aboutController]);
app.controller('contactController', ['$scope', contactController]);
app.controller('todoController', ['$scope', 'Generations', todoController]);
