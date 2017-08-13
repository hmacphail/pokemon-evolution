var generationService     = require('./admin/generationService');
var pokemonService        = require('./admin/pokemonService');
var evolutionService      = require('./admin/evolutionService');
var typeService           = require('./admin/typeService');
var effectivenessService  = require('./admin/effectivenessService');
var abilityService        = require('./admin/abilityService');
var abilitysetService     = require('./admin/abilitysetService');
var moveService           = require('./admin/moveService');
var learnsetService       = require('./admin/learnsetService');
var itemService           = require('./admin/itemService');
var gameService           = require('./admin/gameService');

// create factories
var srvc = angular.module('services', []);
srvc.factory('Generations',   ['$http', generationService]);
srvc.factory('Pokemon',       ['$http', pokemonService]);
srvc.factory('Evolutions',    ['$http', evolutionService]);
srvc.factory('Types',         ['$http', typeService]);
srvc.factory('Effectiveness', ['$http', effectivenessService]);
srvc.factory('Abilities',     ['$http', abilityService]);
srvc.factory('Abilitysets',   ['$http', abilitysetService]);
srvc.factory('Moves',         ['$http', moveService]);
srvc.factory('Learnsets',     ['$http', learnsetService]);
srvc.factory('Items',         ['$http', itemService]);
srvc.factory('Games',         ['$http', gameService]);
