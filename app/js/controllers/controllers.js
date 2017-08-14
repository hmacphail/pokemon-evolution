var homeController          = require('./homeController');
var errorController         = require('./errorController');
var generationController    = require('./admin/generationController');
var pokemonController       = require('./admin/pokemonController');
var evolutionController     = require('./admin/evolutionController');
var typeController          = require('./admin/typeController');
var effectivenessController = require('./admin/effectivenessController');
var abilityController       = require('./admin/abilityController');
var abilitysetController    = require('./admin/abilitysetController');
var moveController          = require('./admin/moveController');
var learnsetController      = require('./admin/learnsetController');
var itemController          = require('./admin/itemController');
var gameController          = require('./admin/gameController');

// create controllers
var ctrl = angular.module('controllers', []);

ctrl.controller('homeController', ['$scope', homeController]);
ctrl.controller('errorController', ['$scope', errorController]);
ctrl.controller('generationController', ['$scope', 'Generations', generationController]);
ctrl.controller('pokemonController', ['$scope', 'Pokemon', 'Generations', 'Types', pokemonController]);
ctrl.controller('evolutionController', ['$scope', 'Evolutions', 'Pokemon', 'Items', evolutionController]);
ctrl.controller('typeController', ['$scope', 'Types', typeController]);
ctrl.controller('effectivenessController', ['$scope', 'Effectiveness', 'Generations', 'Types', effectivenessController]);
ctrl.controller('abilityController', ['$scope', 'Abilities', 'Generations', abilityController]);
ctrl.controller('abilitysetController', ['$scope', 'Abilitysets', 'Generations', 'Pokemon', 'Abilities', abilitysetController]);
ctrl.controller('moveController', ['$scope', 'Moves', 'Generations', 'Types', moveController]);
ctrl.controller('learnsetController', ['$scope', 'Learnsets', 'Generations', 'Pokemon', 'Moves', 'Games', learnsetController]);
ctrl.controller('itemController', ['$scope', 'Items', itemController]);
ctrl.controller('gameController', ['$scope', 'Games', 'Generations', gameController]);
