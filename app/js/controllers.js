var homeController          = require('./controllers/homeController');
var errorController         = require('./controllers/errorController');
var generationController    = require('./controllers/admin/generationController');
var pokemonController       = require('./controllers/admin/pokemonController');
var evolutionController     = require('./controllers/admin/evolutionController');
var typeController          = require('./controllers/admin/typeController');
var effectivenessController = require('./controllers/admin/effectivenessController');
var abilityController       = require('./controllers/admin/abilityController');
var abilitysetController    = require('./controllers/admin/abilitysetController');
var moveController          = require('./controllers/admin/moveController');
var learnsetController      = require('./controllers/admin/learnsetController');
var itemController          = require('./controllers/admin/itemController');
var gameController          = require('./controllers/admin/gameController');

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
ctrl.controller('learnsetController', ['$scope', 'Learnsets', 'PokemonLearnsets', 'Generations', 'Pokemon', 'Moves', 'Games', learnsetController]);
ctrl.controller('itemController', ['$scope', 'Items', itemController]);
ctrl.controller('gameController', ['$scope', 'Games', 'Generations', gameController]);
