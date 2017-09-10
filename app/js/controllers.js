homeController          = require('./controllers/homeController');
errorController         = require('./controllers/errorController');
generationController    = require('./controllers/admin/generationController');
pokemonController       = require('./controllers/admin/pokemonController');
evolutionController     = require('./controllers/admin/evolutionController');
typeController          = require('./controllers/admin/typeController');
effectivenessController = require('./controllers/admin/effectivenessController');
abilityController       = require('./controllers/admin/abilityController');
abilitysetController    = require('./controllers/admin/abilitysetController');
moveController          = require('./controllers/admin/moveController');
learnsetController      = require('./controllers/admin/learnsetController');
itemController          = require('./controllers/admin/itemController');
gameController          = require('./controllers/admin/gameController');

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
