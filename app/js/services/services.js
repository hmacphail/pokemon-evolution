var generationService = require('./admin/generationService');
var pokemonService    = require('./admin/pokemonService');
var typeService       = require('./admin/typeService');
var abilityService    = require('./admin/abilityService');
var itemService       = require('./admin/itemService');

// create factories
var srvc = angular.module('services', []);
srvc.factory('Generations', ['$http', generationService]);
srvc.factory('Pokemon',     ['$http', pokemonService]);
srvc.factory('Types',       ['$http', typeService]);
srvc.factory('Abilities',   ['$http', abilityService]);
srvc.factory('Items',       ['$http', itemService]);
