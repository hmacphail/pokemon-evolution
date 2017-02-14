var generationService = require('./admin/generationService');
var typeService = require('./admin/typeService');
var itemService = require('./admin/itemService');

// create factories
var srvc = angular.module('services', []);
srvc.factory('Generations', ['$http', generationService]);
srvc.factory('Types', ['$http', typeService]);
srvc.factory('Items', ['$http', itemService]);
