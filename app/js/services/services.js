var generationService     = require('./admin/generationService');
var pokemonService        = require('./admin/pokemonService');
var typeService           = require('./admin/typeService');
var effectivenessService  = require('./admin/effectivenessService');
var abilityService        = require('./admin/abilityService');
var moveService           = require('./admin/moveService');
var itemService           = require('./admin/itemService');

// create factories
var srvc = angular.module('services', []);
srvc.factory('Generations',   ['$http', generationService]);
srvc.factory('Pokemon',       ['$http', pokemonService]);
srvc.factory('Types',         ['$http', typeService]);
srvc.factory('Effectiveness', ['$http', effectivenessService]);
srvc.factory('Abilities',     ['$http', abilityService]);
srvc.factory('Moves',         ['$http', moveService]);
srvc.factory('Items',         ['$http', itemService]);
