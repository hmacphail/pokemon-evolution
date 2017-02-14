var homeController        = require('./homeController');
var errorController       = require('./errorController');
var generationController  = require('./admin/generationController');
var pokemonController     = require('./admin/pokemonController');
var typeController        = require('./admin/typeController');
var itemController        = require('./admin/itemController');

// create controllers
var ctrl = angular.module('controllers', []);

ctrl.controller('homeController', ['$scope', homeController]);
ctrl.controller('errorController', ['$scope', errorController]);
ctrl.controller('generationController', ['$scope', 'Generations', generationController]);
ctrl.controller('pokemonController', ['$scope', 'Pokemon', 'Generations', 'Types', pokemonController]);
ctrl.controller('typeController', ['$scope', 'Types', typeController]);
ctrl.controller('itemController', ['$scope', 'Items', itemController]);
