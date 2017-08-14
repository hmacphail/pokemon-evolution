var generationService       = require('./services/generationService');
var pokemonService          = require('./services/pokemonService');
var evolutionService        = require('./services/evolutionService');
var typeService             = require('./services/typeService');
var effectivenessService    = require('./services/effectivenessService');
var abilityService          = require('./services/abilityService');
var abilitysetService       = require('./services/abilitysetService');
var moveService             = require('./services/moveService');
var learnsetService         = require('./services/learnsetService');
var itemService             = require('./services/itemService');
var pokemonTypeService      = require('./services/gameService');
var gameService             = require('./services/gameService');
var pokemonLearnsetService  = require('./services/gameService');

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
