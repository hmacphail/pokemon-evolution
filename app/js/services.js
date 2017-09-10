generationService       = require('./services/generationService');
pokemonService          = require('./services/pokemonService');
evolutionService        = require('./services/evolutionService');
typeService             = require('./services/typeService');
effectivenessService    = require('./services/effectivenessService');
abilityService          = require('./services/abilityService');
abilitysetService       = require('./services/abilitysetService');
moveService             = require('./services/moveService');
learnsetService         = require('./services/learnsetService');
itemService             = require('./services/itemService');
pokemonTypeService      = require('./services/gameService');
gameService             = require('./services/gameService');
pokemonLearnsetService  = require('./services/gameService');

// create factories
var srvc = angular.module('services', []);
srvc.factory('Generations',       ['$http', generationService]);
srvc.factory('Pokemon',           ['$http', pokemonService]);
srvc.factory('Evolutions',        ['$http', evolutionService]);
srvc.factory('Types',             ['$http', typeService]);
srvc.factory('Effectiveness',     ['$http', effectivenessService]);
srvc.factory('Abilities',         ['$http', abilityService]);
srvc.factory('Abilitysets',       ['$http', abilitysetService]);
srvc.factory('Moves',             ['$http', moveService]);
srvc.factory('Learnsets',         ['$http', learnsetService]);
srvc.factory('Items',             ['$http', itemService]);
srvc.factory('PokemonTypes',      ['$http', pokemonTypeService]);
srvc.factory('Games',             ['$http', gameService]);
srvc.factory('PokemonLearnsets',  ['$http', pokemonLearnsetService]);
