
angular.module('scotchApp', ['controllers', 'services', 'ngRoute'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl : '/app/views/home.html',
            controller  : 'mainController'
        })

        // route for the about page
        .when('/about', {
            templateUrl : '/app/views/about.html',
            controller  : 'aboutController'
        })

        // route for the contact page
        .when('/contact', {
            templateUrl : '/app/views/contact.html',
            controller  : 'contactController'
        })

        // route for the todo page
        .when('/todo', {
            templateUrl : '/app/views/todo.html',
            controller  : 'todoController'
        })

        .otherwise({redirectTo: '/'});

}]);
/*
// create the controller and inject Angular's $scope
scotchApp.controller('mainController', function($scope) {
    // create a message to display in our view
    $scope.message = 'Everyone come and see how good I look!';
});

scotchApp.controller('aboutController', function($scope) {
    $scope.message = 'Look! I am an about page.';
});

scotchApp.controller('contactController', function($scope) {
    $scope.message = 'Contact us! JK. This is just a demo.';
});*/