var todoService = require('./admin/todoService');

// create factories
var srvc = angular.module('services', []);
srvc.factory('Generations', ['$http', todoService]);
