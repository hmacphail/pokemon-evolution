var homeController = require('./homeController');
var errorController = require('./errorController');
var adminController = require('./admin/adminController');
var todoController = require('./admin/todoController');

// create controllers
var ctrl = angular.module('controllers', []);

ctrl.controller('homeController', ['$scope', homeController]);
ctrl.controller('errorController', ['$scope', errorController]);
ctrl.controller('adminController', ['$scope', adminController]);
ctrl.controller('todoController', ['$scope', 'Generations', todoController]);
