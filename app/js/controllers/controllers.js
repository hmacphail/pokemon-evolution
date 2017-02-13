var homeController = require('./homeController');
var aboutController = require('./aboutController');
var contactController = require('./contactController');
var todoController = require('./todoController');

// create controllers
var ctrl = angular.module('controllers', []);

ctrl.controller('homeController', ['$scope', homeController]);
ctrl.controller('aboutController', ['$scope', aboutController]);
ctrl.controller('contactController', ['$scope', contactController]);
ctrl.controller('todoController', ['$scope', 'Generations', todoController]);
