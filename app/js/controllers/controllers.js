var homeController = require('./homeController');
var errorController = require('./errorController');
var generationController = require('./admin/generationController');
var typeController = require('./admin/typeController');
var itemController = require('./admin/itemController');

// create controllers
var ctrl = angular.module('controllers', []);

ctrl.controller('homeController', ['$scope', homeController]);
ctrl.controller('errorController', ['$scope', errorController]);
ctrl.controller('generationController', ['$scope', 'Generations', generationController]);
ctrl.controller('typeController', ['$scope', 'Types', typeController]);
ctrl.controller('itemController', ['$scope', 'Items', itemController]);
