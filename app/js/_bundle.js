(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function ($scope, Abilities, Generations) {

  $scope.formData = {};
  getAllAbilities();
  getGenData();

  $scope.createAbilitiesBulk = function() {
    Abilities.bulkCreate(parseBulkData($scope.formData))
      .then(function(res) {
        if (res.status == 200) {
          $scope.formData = {};
          getAllAbilities();
        }
      });
  }

  $scope.deleteAbility = function(id) {
    Abilities.delete(id)
      .then(function(res) {
        getAllAbilities();
      });
  };


  // --- helper functions ---

  function getAllAbilities() {
    Abilities.get().then(function(res){
      $scope.abilities = res.data;
    });
  };

  function getGenData() {
    Generations.get().then(function(res){
      $scope.generations = res.data;
    });
  }

  function parseBulkData(inputData) {
    // parse pasted data from bulbapedia table
    // http://bulbapedia.bulbagarden.net/wiki/Ability#List_of_Abilities
    var abilities = [];
    inputData.bulk.split('\n').forEach(function(a){
      var ability = a.split('\t');
      abilities.push({
        "name" : ability[1],
        "description" : ability[2],
        "genIntroducedId" : genIdByName(ability[3])
      });
    });
    return abilities;
  }

  function genIdByName(name) {
    for (var i = 0; i < $scope.generations.length; i++){
      if ($scope.generations[i].name == name){
        return $scope.generations[i].id
      }
    }
  }

};

},{}],2:[function(require,module,exports){
module.exports = function ($scope, Effectiveness, Generations, Types) {

  $scope.formData = {};
  getAllEffectiveness();
  getGenAndTypeData();

  $scope.createEffectivenessBulk = function() {
    // prep data to send
    var effectiveness = checkBulkForDuplicates(parseBulkData($scope.formData));

    Effectiveness.bulkCreate(effectiveness)
      .then(function(res) {
        if (res.status == 200) {
          $scope.formData = {};
          getAllEffectiveness();
        }
      });
  }

  $scope.deleteEffectiveness = function(id) {
    Effectiveness.delete(id)
      .then(function(res) {
        getAllEffectiveness();
      });
  };


  // --- helper functions ---

  function getAllEffectiveness() {
    Effectiveness.get().then(function(res){
      $scope.effectiveness = res.data;
    });
  };

  function getGenAndTypeData() {
    Generations.get().then(function(res){
      $scope.generations = res.data;
    });
    Types.get().then(function(res){
      $scope.types = res.data;
    });
  }

  function parseBulkData(inputData) {
    // parse pasted data from bulbapedia table
    // http://bulbapedia.bulbagarden.net/wiki/Type/Type_chart
    var effectiveness = [];
    var effects = inputData.bulk.split('\n');

    for (var ii = 0; ii < effects.length; ii++) {
      var e = effects[ii].split('\t');
      var attType = typeIdByName(e[0]);

      for (var jj = 0; jj < effects.length; jj++) {

        var defType = typeIdByName(effects[jj].substr(0, effects[jj].indexOf('\t')));
        try {
          effectiveness.push({
            "comparison" : getComparisonEnum(e[jj+1]),
            "attackingTypeId" : attType,
            "defendingTypeId" : defType,
            "genIntroducedId" : parseInt(inputData.fromGen),
            "genCompletedId" : parseInt(inputData.toGen)
          });
        }
        catch(error) {
          console.log(error);
          return [];
        }
      }
    }
    return effectiveness;
  }

  function checkBulkForDuplicates(dataToCheck) {
    // check against existing data for matches
    var bulkDataToSend = [];
    dataToCheck.forEach(function(newEffect) {
      // add every object to send array
      bulkDataToSend.push(newEffect);

      for(var i = 0; i< $scope.effectiveness.length; i++) {
        var oldEffect = $scope.effectiveness[i];

        // skip if old & new generation ranges are equivalent
        if (newEffect.genIntroducedId != oldEffect.genIntroducedId
          && newEffect.genCompletedId != oldEffect.genCompletedId) {

          // if this effectiveness is equal to a previous generation (or another entry in DB)
          if (newEffect.attackingTypeId == oldEffect.attackingTypeId
            && newEffect.defendingTypeId == oldEffect.defendingTypeId
            && newEffect.comparison == oldEffect.comparison
            && newEffect.genIntroducedId == oldEffect.genCompletedId + 1) {

            bulkDataToSend.pop(); // remove from send array if just updating
            newEffect.genIntroducedId = oldEffect.genIntroducedId;
            Effectiveness.update(oldEffect.id, newEffect); // send update data
            break;
          }
        }
      }
    });
    return bulkDataToSend;
  }

  function typeIdByName(name) {
    for (var i = 0; i < $scope.types.length; i++){
      if ($scope.types[i].name == name){
        return $scope.types[i].id
      }
    }
  }

  function getComparisonEnum(multiplier) {
    switch(multiplier) {
      case "2×" : return "strong";
      case "1×" : return "neutral";
      case "½×" : return "weak";
      case "0×" : return "unaffected";
      default : throw new Error();
    }
  }

};

},{}],3:[function(require,module,exports){
module.exports = function ($scope, Evolution, Pokemon, Item) {

  $scope.formData = {};
  $scope.triggers = ['level', 'item', 'trade', 'happiness', 'other'];
  getAllEvolutions();
  getPokemonAndItemData();

  $scope.createEvolutionsBulk = function() {
    var evolutions = [];
    if ($scope.formData.trigger == 'level') {
      var evolutions = parseBulkData($scope.formData);
    }

    Evolution.bulkCreate(evolutions)
      .then(function(res) {
        if (res.status == 200) {
          $scope.formData = {};
          getAllEvolutions();
        }
      });
  };

  $scope.deleteEvolution = function(id) {
    Evolution.delete(id)
      .then(function(res) {
        getAllEvolutions();
      });
  };

  $scope.pokemonName = function(pokemonId) {
    if ($scope.pokemon) {
      for (var i = 0; i < $scope.pokemon.length; i++){
        if ($scope.pokemon[i].id == [pokemonId]){
          return $scope.pokemon[i].name + ($scope.pokemon[i].form == 'alolan' ? '*' : '');
        }
      }
    }
  };

  // --- helper functions ---

  function getAllEvolutions() {
    Evolution.get().then(function(res){
      $scope.evolutions = res.data;
    });
  };

  function getPokemonAndItemData() {
    Pokemon.get().then(function(res){
      $scope.pokemon = res.data;
    });
    Item.get().then(function(res){
      $scope.items = res.data;
    });
  }

  function parseBulkData(inputData) {
    // parse pasted data from evolutions tables
    // https://pokemondb.net/evolution/level
    var evolutions = [];
    var prev = [];

    inputData.bulk.split('\n').forEach(function(e) {
      var evo = e.split('\t');

      if (evo.length <= 3 ) { // dual row data entry
        if (evo.length == 1) {
          // unnecessary duplicate row -- do nothing
        }
        else if (prev.length == 0) { // first row
          prev = evo;
        }
        else { // second row
          var frmPoke = checkAlolan(prev[0])
            ? pokemonIdByName(splitPokemonNameString(prev[0].split(' ')[1]), true)
            : pokemonIdByName(splitPokemonNameString(prev[0]), false);
          var toPoke = checkAlolan(prev[2])
            ? pokemonIdByName(splitPokemonNameString(prev[2].split(' ')[1]), true)
            : pokemonIdByName(splitPokemonNameString(prev[2].split(' ')[0]), false);
          var specialForm = checkSpecialForm(prev[2]) ? evo[0] : null;

          evolutions.push(createEvolutionObj(frmPoke, toPoke, evo[2], evo[1], null, specialForm));
          prev = [];
        }
      }
      else { // regular data row
        var frmPoke = pokemonIdByName(splitPokemonNameString(evo[0]));
        var toPoke = pokemonIdByName(splitPokemonNameString(evo[2]));
        evolutions.push(createEvolutionObj(frmPoke, toPoke, evo[4], evo[3], null, null));
      }
    });
    //console.log(evolutions);
    return evolutions;
  }

  function createEvolutionObj(fromPokemon, toPokemon, condition, level, item, form) {
    return {
      "fromPokemonId" : fromPokemon,
      "toPokemonId" : toPokemon,
      "trigger" : $scope.formData.trigger,
      "condition" : condition ? condition : null,
      "atLevel" : level,
      "itemId" : item,
      "form" : form
    };
  }

  function splitPokemonNameString(inputStr) {
    var len = inputStr.length;
    var firstHalf = inputStr.substr(0, len/2);
    var secondHalf = inputStr.substr(len/2, len/2);

    if (firstHalf === secondHalf)
      return firstHalf;
    else
      return inputStr;
  }

  function checkAlolan(inputStr) {
    return inputStr.split(' ')[0] === "Alolan";
  }

  function checkSpecialForm(inputStr) {
    return inputStr.indexOf('(') >= 0;
  }

  function pokemonIdByName(name, isAlolan) {
    for (var i = 0; i < $scope.pokemon.length; i++){
      if ($scope.pokemon[i].name == name){
        if ((isAlolan && $scope.pokemon[i].form == 'alolan')
          || (!isAlolan && $scope.pokemon[i].form == 'original'))
        return $scope.pokemon[i].id
      }
    }
  }

  function itemIdByName(name) {
    for (var i = 0; i < $scope.items.length; i++){
      if ($scope.items[i].name == name){
        return $scope.items[i].id
      }
    }
  }

};

},{}],4:[function(require,module,exports){
module.exports = function ($scope, Generations) {

  $scope.formData = {};
  getAllGens();

  $scope.createGen = function() {
    Generations.create($scope.formData)
      .then(function(res) {
        if (res.status == 200) {
          $scope.formData = {};
          getAllGens();
        }
      });
  };

  $scope.deleteGen = function(id) {
    Generations.delete(id)
      .then(function(res) {
        getAllGens();
      });
  };


  // --- helper functions ---

  function getAllGens() {
    Generations.get().then(function(res){
      $scope.generations = res.data;
    });
  };

};

},{}],5:[function(require,module,exports){
module.exports = function ($scope, Items) {

  $scope.formData = {};
  getAllItems();

  $scope.createItem = function() {
    Items.create($scope.formData)
      .then(function(res) {
        if (res.status == 200) {
          $scope.formData = {};
          getAllItems();
        }
      });
  };

  $scope.createItemsBulk = function() {
    Items.bulkCreate(parseBulkData($scope.formData))
      .then(function(res) {
        if (res.status == 200) {
          $scope.formData = {};
          getAllItems();
        }
      });
  }

  $scope.deleteItem = function(id) {
    Items.delete(id)
      .then(function(res) {
        getAllItems();
      });
  };


  // --- helper functions ---

  function getAllItems() {
    Items.get().then(function(res){
      $scope.items = res.data;
    });
  };

  function parseBulkData(inputData) {
    // parse pasted data from evolutionary items table
    // http://www.serebii.net/itemdex/list/evolutionary.shtml
    var items = [];
    inputData.bulk.split('\n\n').forEach(function(i){
      var item = i.split('\t');
      items.push({
        "name" : item[0],
        "description" : item[1]
      });
    });
    return items;
  }

};

},{}],6:[function(require,module,exports){
module.exports = function ($scope, Moves, Generations, Types) {

  $scope.formData = {};
  getAllMoves();
  getGenAndTypeData();

  $scope.createMove = function() {
    Moves.create(createMoveObj($scope.formData.text))
      .then(function(res) {
        if (res.status == 200) {
          $scope.formData = {};
          getAllMoves();
        }
      });
  };

  $scope.createMovesBulk = function() {
    Moves.bulkCreate(parseBulkData($scope.formData))
      .then(function(res) {
        if (res.status == 200) {
          $scope.formData = {};
          getAllMoves();
        }
      });
  }

  $scope.deleteMove = function(id) {
    Moves.delete(id)
      .then(function(res) {
        getAllMoves();
      });
  };


  // --- helper functions ---

  function getAllMoves() {
    Moves.get().then(function(res){
      $scope.moves = res.data;
    });
  };

  function getGenAndTypeData() {
    Generations.get().then(function(res){
      $scope.generations = res.data;
    });
    Types.get().then(function(res){
      $scope.types = res.data;
    });
  }

  function parseBulkData(inputData) {
    // parse pasted data from bulbapedia
    // http://bulbapedia.bulbagarden.net/wiki/List_of_moves
    var moves = [];
    inputData.bulk.split('\n').forEach(function(m) {

      // check if including moves with generation-based conditions
      if (inputData.includeStarred || m.indexOf('*') < 0) {
        moves.push(createMoveObj(m));
      }

    });

    return moves;
  }

  function createMoveObj(data) {
    var move = data.replace(/\*/g, '').split('\t');
    // if spaces instead of tab character
    if (move.length == 1) {
      move = move[0].split('   ');
      move.forEach(function(m, i){
        move[i] = m.trim();
      });
    }
    var gens = move[8].split('-');

    return {
      "name" : move[1],
      "typeId" : typeIdByName(move[2]),
      "category" : move[3].toLowerCase(),
      "pp" : move[5],
      "power" : isNumber(move[6]) ? move[6] : null,
      "accuracy" : isNumber(move[7]) ? move[7].substr(0, move[7].indexOf('%')) : null,
      "genIntroducedId" : genIdByName(gens[0]),
      "genCompletedId" : gens.length > 1 ? genIdByName(gens[1]) : mostRecentGen(),
      "isTM" : "false",
      "extraInfoColumn" : move.length > 9 ? move[9] : null,
      "extraInfo" : move.length > 9 ? move[10] : null
    };
  }

  function mostRecentGen() {
    var gen = $scope.generations[$scope.generations.length-1].id;
    for (var i = 0; i < $scope.generations.length; i++){
      if (gen < $scope.generations[i].id)
        gen = $scope.generations[i].id;
    }
    return gen;
  }

  function genIdByName(name) {
    for (var i = 0; i < $scope.generations.length; i++){
      if ($scope.generations[i].name == name){
        return $scope.generations[i].id
      }
    }
  }

  function typeIdByName(name) {
    for (var i = 0; i < $scope.types.length; i++){
      if ($scope.types[i].name == name){
        return $scope.types[i].id
      }
    }
  }

  function isNumber(data) {
    return !isNaN(parseInt(data));
  }

};

},{}],7:[function(require,module,exports){
module.exports = function ($scope, Pokemon, Generations, Types) {

  $scope.formData = {};
  getAllPokemon();
  getGenAndTypeData();

  $scope.createPokemonBulk = function() {
    Pokemon.bulkCreate(parseBulkData($scope.formData))
      .then(function(res) {
        if (res.status == 200) {
          $scope.formData = {};
          getAllPokemon();
        }
      });
  }

  $scope.deletePokemon = function(id) {
    Pokemon.delete(id)
      .then(function(res) {
        getAllPokemon();
      });
  };


  // --- helper functions ---

  function getAllPokemon() {
    Pokemon.get().then(function(res){
      $scope.pokemon = res.data;
    });
  };

  function getGenAndTypeData() {
    Generations.get().then(function(res){
      $scope.generations = res.data;
    });
    Types.get().then(function(res){
      $scope.types = res.data;
    });
  }

  function parseBulkData(inputData) {
    // parse pasted data from bulbapedia table
    // http://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_National_Pok%C3%A9dex_number
    var pokemon = [];
    inputData.bulk.split('\n').forEach(function(p){
      var pkmn = p.split('\t');
      pokemon.push({
        "pokedexId" : pkmn[1].substr(1),
        "name" : pkmn[3],
        "form" : (pkmn[0] == " " && inputData.gen == "1" ? "alolan" : "original"),
        "genIntroducedId" : inputData.gen,
        "primaryTypeId" : typeIdByName(pkmn[4]),
        "secondaryTypeId" : (pkmn.length == 6 ? typeIdByName(pkmn[5]) : null)
      });
    });
    return pokemon;
  }

  function typeIdByName(name) {
    for (var i = 0; i < $scope.types.length; i++){
      if ($scope.types[i].name == name){
        return $scope.types[i].id
      }
    }
  }

};

},{}],8:[function(require,module,exports){
module.exports = function ($scope, Types) {

  $scope.formData = {};
  getAllTypes();

  $scope.createType = function() {
    Types.create($scope.formData)
      .then(function(res) {
        if (res.status == 200) {
          $scope.formData = {};
          getAllTypes();
        }
      });
  };

  $scope.deleteType = function(id) {
    Types.delete(id)
      .then(function(res) {
        getAllTypes();
      });
  };


  // --- helper functions ---

  function getAllTypes() {
    Types.get().then(function(res){
      $scope.types = res.data;
    });
  };

};

},{}],9:[function(require,module,exports){
var homeController          = require('./homeController');
var errorController         = require('./errorController');
var generationController    = require('./admin/generationController');
var pokemonController       = require('./admin/pokemonController');
var evolutionController     = require('./admin/evolutionController');
var typeController          = require('./admin/typeController');
var effectivenessController = require('./admin/effectivenessController');
var abilityController       = require('./admin/abilityController');
var moveController          = require('./admin/moveController');
var itemController          = require('./admin/itemController');

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
ctrl.controller('moveController', ['$scope', 'Moves', 'Generations', 'Types', moveController]);
ctrl.controller('itemController', ['$scope', 'Items', itemController]);

},{"./admin/abilityController":1,"./admin/effectivenessController":2,"./admin/evolutionController":3,"./admin/generationController":4,"./admin/itemController":5,"./admin/moveController":6,"./admin/pokemonController":7,"./admin/typeController":8,"./errorController":10,"./homeController":11}],10:[function(require,module,exports){
module.exports = function ($scope) {
    $scope.message = 'Page not found!';
  };


},{}],11:[function(require,module,exports){
module.exports = function ($scope) {
    $scope.message = 'Everyone come and see how good I look!';
  };


},{}],12:[function(require,module,exports){
module.exports = function($http) {
  return {
    get: function() {
      return $http.get('/api/abilities');
    },
    bulkCreate: function(data) {
      return $http.post('/api/abilities/bulk', data);
    },
    delete: function(id) {
      return $http.delete('/api/abilities/' + id);
    }
  }
};

},{}],13:[function(require,module,exports){
module.exports = function($http) {
  return {
    get: function() {
      return $http.get('/api/effectiveness');
    },
    create: function(data) {
      return $http.post('/api/effectiveness', data);
    },
    bulkCreate: function(data) {
      return $http.post('/api/effectiveness/bulk', data);
    },
    update: function(id, data) {
      return $http.put('/api/effectiveness/' + id, data);
    },
    delete: function(id) {
      return $http.delete('/api/effectiveness/' + id);
    }
  }
};

},{}],14:[function(require,module,exports){
module.exports = function($http) {
  return {
    get: function() {
      return $http.get('/api/evolutions');
    },
    bulkCreate: function(data) {
      return $http.post('/api/evolutions/bulk', data);
    },
    delete: function(id) {
      return $http.delete('/api/evolutions/' + id);
    }
  }
};

},{}],15:[function(require,module,exports){
module.exports = function($http) {
  return {
    get: function() {
      return $http.get('/api/generations');
    },
    create: function(data) {
      return $http.post('/api/generations', data);
    },
    delete: function(id) {
      return $http.delete('/api/generations/' + id);
    }
  }
};

},{}],16:[function(require,module,exports){
module.exports = function($http) {
  return {
    get: function() {
      return $http.get('/api/items');
    },
    create: function(data) {
      return $http.post('/api/items', data);
    },
    bulkCreate: function(data) {
      return $http.post('/api/items/bulk', data);
    },
    delete: function(id) {
      return $http.delete('/api/items/' + id);
    }
  }
};

},{}],17:[function(require,module,exports){
module.exports = function($http) {
  return {
    get: function() {
      return $http.get('/api/moves');
    },
    create: function(data) {
      return $http.post('/api/moves', data);
    },
    bulkCreate: function(data) {
      return $http.post('/api/moves/bulk', data);
    },
    delete: function(id) {
      return $http.delete('/api/moves/' + id);
    }
  }
};

},{}],18:[function(require,module,exports){
module.exports = function($http) {
  return {
    get: function() {
      return $http.get('/api/pokemon');
    },
    bulkCreate: function(data) {
      return $http.post('/api/pokemon/bulk', data);
    },
    delete: function(id) {
      return $http.delete('/api/pokemon/' + id);
    }
  }
};

},{}],19:[function(require,module,exports){
module.exports = function($http) {
  return {
    get: function() {
      return $http.get('/api/types');
    },
    create: function(data) {
      return $http.post('/api/types', data);
    },
    delete: function(id) {
      return $http.delete('/api/types/' + id);
    }
  }
};

},{}],20:[function(require,module,exports){
var generationService     = require('./admin/generationService');
var pokemonService        = require('./admin/pokemonService');
var evolutionService      = require('./admin/evolutionService');
var typeService           = require('./admin/typeService');
var effectivenessService  = require('./admin/effectivenessService');
var abilityService        = require('./admin/abilityService');
var moveService           = require('./admin/moveService');
var itemService           = require('./admin/itemService');

// create factories
var srvc = angular.module('services', []);
srvc.factory('Generations',   ['$http', generationService]);
srvc.factory('Pokemon',       ['$http', pokemonService]);
srvc.factory('Evolutions',    ['$http', evolutionService]);
srvc.factory('Types',         ['$http', typeService]);
srvc.factory('Effectiveness', ['$http', effectivenessService]);
srvc.factory('Abilities',     ['$http', abilityService]);
srvc.factory('Moves',         ['$http', moveService]);
srvc.factory('Items',         ['$http', itemService]);

},{"./admin/abilityService":12,"./admin/effectivenessService":13,"./admin/evolutionService":14,"./admin/generationService":15,"./admin/itemService":16,"./admin/moveService":17,"./admin/pokemonService":18,"./admin/typeService":19}],21:[function(require,module,exports){
require('./controllers/controllers');
require('./services/services');

var app = angular.module('pokelution', ['controllers', 'services', 'ngRoute']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl : '/views/home.html',
      controller  : 'homeController'
    })
    .when('/404', {
      templateUrl : '/views/error.html',
      controller  : 'errorController'
    })
    .when('/admin/generations', {
      templateUrl : '/views/admin/generations.html',
      controller  : 'generationController'
    })
    .when('/admin/pokemon', {
      templateUrl : '/views/admin/pokemon.html',
      controller  : 'pokemonController'
    })
    .when('/admin/evolutions', {
      templateUrl : '/views/admin/evolutions.html',
      controller  : 'evolutionController'
    })
    .when('/admin/types', {
      templateUrl : '/views/admin/types.html',
      controller  : 'typeController'
    })
    .when('/admin/effectiveness', {
      templateUrl : '/views/admin/effectiveness.html',
      controller  : 'effectivenessController'
    })
    .when('/admin/abilities', {
      templateUrl : '/views/admin/abilities.html',
      controller  : 'abilityController'
    })
    .when('/admin/moves', {
      templateUrl : '/views/admin/moves.html',
      controller  : 'moveController'
    })
    .when('/admin/items', {
      templateUrl : '/views/admin/items.html',
      controller  : 'itemController'
    })
    .otherwise({redirectTo: '/404'});
  $locationProvider.html5Mode(true);
}]);

},{"./controllers/controllers":9,"./services/services":20}]},{},[21]);
