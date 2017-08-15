(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./controllers');
require('./services');

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
    .when('/admin/abilitysets', {
      templateUrl : '/views/admin/abilitysets.html',
      controller  : 'abilitysetController'
    })
    .when('/admin/moves', {
      templateUrl : '/views/admin/moves.html',
      controller  : 'moveController'
    })
    .when('/admin/learnsets', {
      templateUrl : '/views/admin/learnsets.html',
      controller  : 'learnsetController'
    })
    .when('/admin/items', {
      templateUrl : '/views/admin/items.html',
      controller  : 'itemController'
    })
    .when('/admin/games', {
      templateUrl : '/views/admin/games.html',
      controller  : 'gameController'
    })
    .otherwise({redirectTo: '/404'});
  $locationProvider.html5Mode(true);
}]);

},{"./controllers":2,"./services":18}],2:[function(require,module,exports){
var homeController          = require('./controllers/homeController');
var errorController         = require('./controllers/errorController');
var generationController    = require('./controllers/admin/generationController');
var pokemonController       = require('./controllers/admin/pokemonController');
var evolutionController     = require('./controllers/admin/evolutionController');
var typeController          = require('./controllers/admin/typeController');
var effectivenessController = require('./controllers/admin/effectivenessController');
var abilityController       = require('./controllers/admin/abilityController');
var abilitysetController    = require('./controllers/admin/abilitysetController');
var moveController          = require('./controllers/admin/moveController');
var learnsetController      = require('./controllers/admin/learnsetController');
var itemController          = require('./controllers/admin/itemController');
var gameController          = require('./controllers/admin/gameController');

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

},{"./controllers/admin/abilityController":3,"./controllers/admin/abilitysetController":4,"./controllers/admin/effectivenessController":5,"./controllers/admin/evolutionController":6,"./controllers/admin/gameController":7,"./controllers/admin/generationController":8,"./controllers/admin/itemController":9,"./controllers/admin/learnsetController":10,"./controllers/admin/moveController":11,"./controllers/admin/pokemonController":12,"./controllers/admin/typeController":13,"./controllers/errorController":14,"./controllers/homeController":15}],3:[function(require,module,exports){
DataStore = require('../../lib/dataStore');

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

},{"../../lib/dataStore":16}],4:[function(require,module,exports){
module.exports = function ($scope, Abilitysets, Generations, Pokemon, Abilities) {

  $scope.formData = {};
  getAllAbilitysets();
  getAssociatedData();

  $scope.createAbilitysetsBulk = function() {
    Abilitysets.bulkCreate(parseBulkData($scope.formData))
      .then(function(res) {
        if (res.status == 200) {
          $scope.formData = {};
          getAllAbilitysets();
        }
      });
  }

  $scope.deleteAbilityset = function(id) {
    Abilitysets.delete(id)
      .then(function(res) {
        getAllAbilitysets();
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

  $scope.abilityName = function(abilityId) {
    if ($scope.abilities) {
      for (var i = 0; i < $scope.abilities.length; i++){
        if ($scope.abilities[i].id == [abilityId]){
          return $scope.abilities[i].name;
        }
      }
    }
  }


  // --- helper functions ---

  function getAllAbilitysets() {
    Abilitysets.get().then(function(res){
      $scope.abilitysets = res.data;
    });
  };

  function getAssociatedData() {
    Generations.get().then(function(res){
      $scope.generations = res.data;
    });
    Pokemon.get().then(function(res){
      $scope.pokemon = res.data;
    });
    Abilities.get().then(function(res){
      $scope.abilities = res.data;
    });
  }

  function parseBulkData(inputData) {
    // parse pasted data from bulbapedia table
    // http://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_Ability
    var abilitysets = [];
    //var prevName = "";
    inputData.bulk.split('\n').forEach(function(a){
      var as = a.split('\t');
      // if spaces instead of tab character
      if (as.length == 1) {
        as = as[0].split('   ');
        as.forEach(function(a, i){
          as[i] = a.trim();
        });
      }

      // find duplicate rows of the same pokemon
      //if (as[2].replace('*', '').includes(prevName.replace('*', ''))) {
      //  console.log(as[2]);
      //}
      //else {
      var pokeIds = pokemonIdsByName(as[2], as[1]);

      // use pokemon's gen if no gen provided
      // only need to check first pokemonId as should all be same gen
      var genIntro = as[6] || generationByPokemonId(pokeIds[0]);
      var genCompl = as[7] || null;

      if (as[3] && (!inputData.includeStarred && as[3].indexOf('*') < 0 ||
        inputData.includeStarred && as[3].indexOf('*') >= 0)) {
        // primary ability
        createAbilitysetObjs(pokeIds, abilityIdByName(as[3]), "primary", genIntro, genCompl).forEach(function(as) {
          abilitysets.push(as);
        });
      }
      if (as[4] && (!inputData.includeStarred && as[4].indexOf('*') < 0 ||
        inputData.includeStarred && as[4].indexOf('*') >= 0)) {
        // secondary ability
        createAbilitysetObjs(pokeIds, abilityIdByName(as[4]), "secondary", genIntro, genCompl).forEach(function(as) {
          abilitysets.push(as);
        });
      }
      if (as[5] && (!inputData.includeStarred && as[5].indexOf('*') < 0 ||
        inputData.includeStarred && as[5].indexOf('*') >= 0)) {
        // hidden ability
        createAbilitysetObjs(pokeIds, abilityIdByName(as[5]), "hidden", genIntro, genCompl).forEach(function(as) {
          abilitysets.push(as);
        });
      }
      //}
      //prevName = as[2];

    });

    return abilitysets;
  }

  function createAbilitysetObjs(pokemonIds, abilityId, trait, genIntroducedId, genCompletedId) {
    // gen introduced is generation of pokemon
    // exception: abilities introduced in Gen III, hidden abilities introduced in Gen V
    if (trait == "hidden" && genIntroducedId < 5) {
      genIntroducedId = 5;
    }
    if (genIntroducedId < 3) {
      genIntroducedId = 3;
    }

    var as = [];
    for (var i = 0; i < pokemonIds.length; i++) {
      as.push({
        "pokemonId" : pokemonIds[i],
        "abilityId" : abilityId,
        "genIntroducedId" : genIntroducedId,
        "genCompletedId" : genCompletedId,
        "trait" : trait
      });
    }
    return as;
  }

  function pokemonIdsByName(name, variation) {
    name = name.replace('*', '');
    var pm = [];
    var isAlolan = (name.indexOf('Alolan') >= 0);
    if (isAlolan) {
      name = name.split(' ')[1];
    }
    for (var i = 0; i < $scope.pokemon.length; i++){
      var p = $scope.pokemon[i];

      // check that name matches
      if (p.name == name){

        // check that isAlolan if required
        if ((!isAlolan && p.form != 'alolan') ||
          (isAlolan && p.form == 'alolan')) {

          // check that variation matches if required (unless mega)
          if (variation == name || p.form == 'mega' || p.variation == variation) {
            pm.push(p.id);
          }
        }
      }
    }

    return pm;
  }

  function generationByPokemonId(pokemonId) {
    for (var i = 0; i < $scope.pokemon.length; i++){
      if ($scope.pokemon[i].id == pokemonId){
        return $scope.pokemon[i].genIntroducedId;
      }
    }
  }

  function abilityIdByName(name) {
    name = name.replace('*', '');
    for (var i = 0; i < $scope.abilities.length; i++){
      if ($scope.abilities[i].name == name){
        return $scope.abilities[i].id;
      }
    }
  }

};

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
module.exports = function ($scope, Evolution, Pokemon, Item) {

  $scope.formData = {};
  $scope.triggers = ['level', 'item', 'trade', 'happiness', 'other'];
  getAllEvolutions();
  getPokemonAndItemData();

  $scope.createEvolutionsBulk = function() {
    if ($scope.formData.trigger) {
      Evolution.bulkCreate(parseBulkData($scope.formData))
        .then(function(res) {
          if (res.status == 200) {
            $scope.formData = {};
            getAllEvolutions();
          }
        });
    }
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

  $scope.itemName = function(itemId) {
    if ($scope.items) {
      for (var i = 0; i < $scope.items.length; i++){
        if ($scope.items[i].id == [itemId]){
          return $scope.items[i].name;
        }
      }
    }
  }

  //====== remote data retrieval ========
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
  };

  //======= main parser functions ========
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
          var evs = parseDataRow(inputData.trigger, prev, evo);
          evs.forEach(function(e) {
            evolutions.push(e);
          });
          prev = [];
        }
      }
      else { // regular data row
        var evs = parseDataRow(inputData.trigger, evo);
        evs.forEach(function(e) {
          evolutions.push(e);
        });
      }
    });
    if (prev.length != 0) { // missed last entry
      var evs = parseDataRow(inputData.trigger, prev);
      evs.forEach(function(e) {
        evolutions.push(e);
      });
    }

    console.log(evolutions);
    return evolutions;
  };

  function parseDataRow(trigger, row1, row2) {
    if (row2) { // dual row data entry
      var variation = checkSpecialCondition(row1[2]) ? row2[0] : null;

      var frmPoke = checkAlolan(row1[0])
          ? pokemonObjsByName(splitPokemonNameString(row1[0].split(' ')[1]), variation, true)
          : pokemonObjsByName(splitPokemonNameString(row1[0]), variation, false);
      var toPoke = checkAlolan(row1[2])
          ? pokemonObjsByName(splitPokemonNameString(row1[2].split(' ')[1]), variation, true)
          : pokemonObjsByName(splitPokemonNameString(row1[2].split(' ')[0]), variation, false);

      switch (trigger) {
        case 'level' :
          return createEvolutionObjs(frmPoke, toPoke, row2[2], row2[1], null);
        case 'item' :
          var itemCond = splitItemConditionString(row2[1]);
          return createEvolutionObjs(frmPoke, toPoke, itemCond[1], null, itemIdByName(itemCond[0]));
        case 'trade' :
          return createEvolutionObjs(frmPoke, toPoke, row2[1], null, null);
        case 'happiness' :
          return createEvolutionObjs(frmPoke, toPoke, row2[1], null, null);
        case 'other' :
          if (row2[1] || row2[2].indexOf('Trade') >= 0) { // duplicate from other triggers
            return [];
          }
          return createEvolutionObjs(frmPoke, toPoke, row2[2], null, null);
      }

    } else { // regular data row
      var frmPoke = pokemonObjsByName(splitPokemonNameString(row1[0]));
      var toPoke = pokemonObjsByName(splitPokemonNameString(row1[2]));

      switch (trigger) {
        case 'level' :
          return createEvolutionObjs(frmPoke, toPoke, row1[4], row1[3], null);
        case 'item' :
          var itemCond = splitItemConditionString(row1[3]);
          return createEvolutionObjs(frmPoke, toPoke, itemCond[1], null, itemIdByName(itemCond[0]));
        case 'trade' :
          var item = itemIdByName(row1[3]);
          var cond = item ? null : row1[3];
          return createEvolutionObjs(frmPoke, toPoke, cond, null, item);
        case 'happiness' :
          return createEvolutionObjs(frmPoke, toPoke, row1[3], null, null);
        case 'other' :
          if (row1[3] || row1[4].indexOf('Trade') >= 0) { // duplicate from other triggers
            return [];
          }
          return createEvolutionObjs(frmPoke, toPoke, row1[4], null, null);
      }

    }
  }


  //======= data preparation ==========
  function createEvolutionObjs(fromPokemon, toPokemon, condition, level, item) {
    var evs = [];
    for (var f = 0; f < fromPokemon.length; f++) {
      for (var t = 0; t < toPokemon.length; t++) {
        var from = fromPokemon[f];
        var to = toPokemon[t];
        // if both from and to pokemon have variations, only include when variations match
        if (from.variation != null && to.variation != null && from.variation != to.variation) {
          continue;
        }
        evs.push({
          "fromPokemonId" : from.id,
          "toPokemonId" : to.id,
          "trigger" : $scope.formData.trigger,
          "condition" : condition ? condition : null,
          "atLevel" : level,
          "itemId" : item
        });
      }
    }
    return evs;
  };

  function splitPokemonNameString(inputStr) {
    var len = inputStr.length;
    var firstHalf = inputStr.substr(0, len/2);
    var secondHalf = inputStr.substr(len/2, len/2);

    if (firstHalf === secondHalf)
      return firstHalf;
    else
      return inputStr;
  };

  function checkSpecialCondition(inputStr) {
    return inputStr.indexOf('(') >= 0;
  };

  function checkAlolan(inputStr) {
    return inputStr.split(' ')[0] === "Alolan";
  };

  //---- data parsing for item trigger ----
  function splitItemConditionString(inputStr) {
    var bracketInd = inputStr.indexOf('(');
    if (bracketInd >= 0) {
      var item = inputStr.substring(0, bracketInd).trim();
      var condition = inputStr.substring(bracketInd + 1, inputStr.indexOf(')'));
      return [item, condition];
    }
    return [inputStr];
  }

  //======= find entries by name string ========
  function pokemonObjsByName(name, variation, isAlolan) {
    var pm = [];
    for (var i = 0; i < $scope.pokemon.length; i++){
      var p = $scope.pokemon[i];

      // check that name matches
      if (p.name == name) {

        // check that isAlolan if required
        if ((isAlolan && p.form == 'alolan')
          || (!isAlolan && p.form == 'original')) {

          // check that variation matches if required
          if (variation == null || p.variation == null || p.variation == variation) {
            pm.push(p);
          }
        }
      }
    }
    return pm;
  };

  function itemIdByName(name) {
    for (var i = 0; i < $scope.items.length; i++){
      if ($scope.items[i].name == name){
        return $scope.items[i].id
      }
    }
    return null;
  };

};

},{}],7:[function(require,module,exports){
module.exports = function ($scope, Games, Generations) {

  $scope.formData = {};
  getAllGames();
  getAllGenerations();

  $scope.createGame = function() {
    Games.create(createGameObj($scope.formData))
      .then(function(res) {
        if (res.status == 200) {
          $scope.formData = {};
          getAllGames();
        }
      });
  };

  $scope.deleteGame = function(id) {
    Games.delete(id)
      .then(function(res) {
        getAllGames();
      });
  };


  // --- helper functions ---

  function createGameObj(formData) {
    return {
      "code": formData.code,
      "name": formData.name,
      "generationId": generationIdByName(formData.generation)
    };
  }

  function getAllGames() {
    Games.get().then(function(res){
      $scope.games = res.data;
    });
  };

  function getAllGenerations() {
    Generations.get().then(function(res){
      $scope.generations = res.data;
    });
  }

  function generationIdByName(name) {
    for (var i = 0; i < $scope.generations.length; i++){
      if ($scope.generations[i].name == name){
        return $scope.generations[i].id
      }
    }
    return null;
  };

};

},{}],8:[function(require,module,exports){
var Promise = require('promise');
DataStore = require('../../lib/dataStore');

module.exports = function ($scope, Generations) {

  $scope.formData = {};
  getAllGenerations();
  //DataStore.getAllGenerations($scope.generations, Generations);

  $scope.createGen = function() {
    Generations.create($scope.formData)
      .then(function(res) {
        if (res.status == 200) {
          $scope.formData = {};
          getAllGenerations();
        }
      });
  };

  $scope.deleteGen = function(id) {
    Generations.delete(id)
      .then(function(res) {
        getAllGenerations();
      });
  };


  // --- helper functions ---
  function getAllGenerations() {
    DataStore.getAllGenerations(Generations).then(function(res) {
      $scope.generations = res;
    });
  };

};

},{"../../lib/dataStore":16,"promise":32}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
require('../../lib/tableToJson');

module.exports = function ($scope, Learnset, PokemonLearnset, Generation, Pokemon, Move, Game) {

  $scope.entryCount = 0;
  $scope.pokemonArrayIndex = 0;
  $scope.gameCodesToCheck = ["RGB", "Y", "DP", "PtHGSS", "DPPt", "HGSS", "BW", "B2W2", "XY", "ORAS"];

  $scope.formData = {};
  getAllLearnsets();
  getAssociatedData();

  $scope.runYqlScript = function() {
    // get list of all pokemon names for selected gen and down
    var pokemon = allPokemonByGeneration($scope.formData.gen);
    var pm = pokemon[24];

    // TEST
    ajaxRequestLearnsetTable(createYqlQueryUrl(pm.name, $scope.formData.gen), pm, false);


    /*var startIndex = $scope.pokemonArrayIndex;
    var endIndex = startIndex + 100;
    for (var i = startIndex; i < Math.min(endIndex, pokemon.length); i++) {
      var pm = pokemon[i];
      ajaxRequestLearnsetTable(
        createYqlQueryUrl(pm.name, $scope.formData.gen),
        pm,
        false
      );
    }
    $scope.pokemonArrayIndex = endIndex;
    */
    /*
    pokemon.forEach(function(pm) {
      ajaxRequestLearnsetTable(
        createYqlQueryUrl(pm.name, $scope.formData.gen),
        pm,
        false
      );
    });
    */
  };

  $scope.createIndividualLearnset = function() {
    Pokemon.getById($scope.formData.individualPokemonId).then(function(res) {
      ajaxRequestLearnsetTable(
        createIndQueryUrl($scope.formData.individualUrl, $scope.formData.individualTableXPath),
        res.data,
        true
      );
    });

  };

  $scope.deleteLearnset = function(id) {
    Learnset.delete(id)
      .then(function(res) {
        getAllLearnsets();
      });
  };

  /*$scope.pokemonName = function(pokemonId) {
    if ($scope.pokemon) {
      for (var i = 0; i < $scope.pokemon.length; i++){
        if ($scope.pokemon[i].id == [pokemonId]){
          return $scope.pokemon[i].name + ($scope.pokemon[i].form == 'alolan' ? '*' : '');
        }
      }
    }
  };

  $scope.moveName = function(moveId) {
    if ($scope.moves) {
      for (var i = 0; i < $scope.moves.length; i++){
        if ($scope.moves[i].id == [moveId]){
          return $scope.moves[i].name;
        }
      }
    }
  }*/

  function createLearnsetObj(moveByLevel, generationId) {
    return {
      "level" : moveByLevel.level,
      "onEvo" : moveByLevel.onEvo,
      "byTM" : false,
      "moveId" : moveIdByName(moveByLevel.move, generationId),
    };
  };

  function createPokemonLearnsetObj(learnsetId, pokemonId, generationId, gameId) {
    return {
      "learnsetId" : learnsetId,
      "pokemonId": pokemonId,
      "genIntroducedId" : generationId,
      "genCompletedId" : generationId,
      "gameId": gameId,
    };
  };

  //====== main parser functions =======
  function parseLearnsetJson(results) {

    var movesByLevel = [];
    results.forEach(function(rowObj) {
      var move = rowObj["Move"];

      // check for game-specific moves
      if (rowObj["Level"]) {
        createMoveDataFromJson(movesByLevel, move, rowObj["Level"], null);

      } else {
        // check all game codes
        $scope.gameCodesToCheck.forEach(function(code) {
          var singleGameCode = code;

          if (rowObj[code]) {
            // extra move entry for doubled up game codes (only occurs when Pt game is included)
            if (code.includes("Pt")) {
              createMoveDataFromJson(movesByLevel, move, rowObj[code], "Pt");
              singleGameCode = code.replace("Pt", "");
            }

            createMoveDataFromJson(movesByLevel, move, rowObj[code], singleGameCode);
          }

        });

      }
    });
    //console.log(movesByLevel);
    return movesByLevel;
  };

  function createMoveDataFromJson(movesArray, move, levelColumn, gameCode) {
    var level = levelColumn.split("\n")[0];
    var onEvo = (level == "Evo"); // check if "on evolution" move
    var gameId = null;

    // find game id based on given code string
    if (gameCode != null) {
      for (var i = 0; i < $scope.games.length; i++) {
        var gm = $scope.games[i];
        if (gameCode == gm.code) {
          gameId = gm.id;
          break;
        }
      }
    }

    // level is a number or onEvo (not N/A)
    if (!isNaN(parseInt(level)) || onEvo) {
      movesArray.push({
        "move" : move,
        "level" : onEvo ? null : parseInt(level),
        "onEvo" : onEvo,
        "gameId" : gameId,
      });
    }
    else if (level != "N/A") {
      console.error("couldn't find move from row", rowObj);
    }
  }

  /**
   * checks existing pokemonLearnsets for duplicates
   * updates duplicate with new genCompletedId
   * @return {bool} returns true if duplicate was found
   */
  function updateIfDuplicate(newPokemonLearnset) {
    // gameId makes pokemonLearnset unique
    if (newPokemonLearnset.gameId != null) {
      return -1;
    }

    // loop through all pokemonLearnsets looking for duplicates on learnset/pokemon relationship
    for (var i = 0; i < $scope.pokemonLearnsets.length; i++) {
      var pl = $scope.pokemonLearnsets[i];

      // only check if old & new generation ranges are different
      // and gameId is null
      if (newPokemonLearnset.genIntroducedId != pl.genIntroducedId &&
        newPokemonLearnset.genCompletedId != pl.genCompletedId &&
        pl.gameId == null) {

        // if newPokemonLearnset is equivalent to another entry in DB
        if (newPokemonLearnset.learnsetId == pl.learnsetId
          && newPokemonLearnset.pokemonId == pl.pokemonId
          && newPokemonLearnset.genIntroducedId == pl.genCompletedId + 1) {

          newPokemonLearnset.genIntroducedId = ls.genIntroducedId;
          PokemonLearnset.update(pl.id, newPokemonLearnset); // send update data
          //console.log(newPokemonLearnset);
          return pl.id;
        }

      }
    }

    return -1;
  }

  function lookForExistingLearnset(newLearnset) {
    // CHECK BOTH DB AND LOCAL BEING-CREATED ARRAY OF LEARNSETS

    // loop through all learnsets looking for duplicates on level/move/etc. association
    for (var i = 0; i < $scope.learnsets.length; i++) {
      var ls = $scope.learnsets[i];

      // if newLearnset is equivalent to another entry in DB
      if (newLearnset.level == ls.level
        && newLearnset.onEvo == ls.onEvo
        && newLearnset.byTM == ls.byTM
        && newLearnset.moveId == ls.moveId) {

        return ls.id;
      }
    }

    return -1;
  }

  //====== data preparation =======
  function prepAndSendLearnsets(res, pokemon, isIndividual) {

    if (!isIndividual && (pokemon.form != 'original' || pokemon.variation != null)) {
      console.log(pokemon);
      return;
    }

    //var learnsets = [], pokemonLearnsets = [];
    $scope.entryCount++;

    console.log(pokemon.name);
    var results = $(res.query.results.result)
      .tableToJSON(
        { ignoreHiddenRows: false }
      );

    var movesByLevel = parseLearnsetJson(results); // parse JSON
    var generationId = generationIdByName($scope.formData.gen);

    //console.log(movesByLevel);

    movesByLevel.forEach(function(move) { // create objects to send
      var newLearnset = createLearnsetObj(move, generationId);
      var learnsetId = lookForExistingLearnset(newLearnset);

      if (learnsetId == -1) {
        // create new learnset and pokemonLearnset
        // NEED TO WAIT FOR THIS TO FINISH BEFORE LOOP CONTINUES...
        // OR SOMEHOW GUARANTEE IT GETS ADDED
        Learnset.create(newLearnset).then(function(res) {
          console.log(res.data);
          PokemonLearnset.create(createPokemonLearnsetObj(res.data.id, pokemon.id, generationId, move.gameId));
        })
        //pokemonLearnsets.push(createPokemonLearnsetObj());
      } else {
        var newPokemonLearnset = createPokemonLearnsetObj(learnsetId, pokemon.id, generationId, move.gameId);
        var pokemonLearnsetId = updateIfDuplicate(newPokemonLearnset);
        if (pokemonLearnsetId == -1) {
          // create new pokemonLearnset
          PokemonLearnset.create(newPokemonLearnset);
        }

      }

      // if (!checkForDuplicates(newLearnset)) {
      //   learnsets.push(newLearnset);
      // }
    });

    //Learnset.bulkCreate(learnsets);

    //console.log(learnsets);
    // send data
    //learnsets.forEach(function(ls) {
    //  Learnset.create(ls);
    //});




      // since we are going thru all pokemon in db not by number or name,
      // create array with one pokemon for creating learnset, but only if form == 'original' or variation == null (??)
      // otherwise, check for existing entry. if not found, create as array like above,
      // if found, create single entry in pokemonLearnset (manually?)
      //
      // cant add variations into pokemon array b/c what if the current gen range is wrong for the pokemon youre adding?

      // creating array like this only good for Gen 1
      // or maybe only for things with no variation (or form..?)




    //});
  };

  /**
   * Produces an array containing pokemon that were introduced on or before the given level
   * @param  string genString    Name of Generation
   * @return Pokemon[]           Array of Pokemon introduced on or before Generation given by genString
   */
  function allPokemonByGeneration(genString) {
    var pokemon = [];
    var gen = generationIdByName(genString);
    $scope.pokemon.forEach(function(p){
      if (p.genIntroducedId <= gen) {
        pokemon.push(p);
      }
    });
    return pokemon;
  };

  //====== query building for learnset table retrieval
  function createYqlQueryUrl(pokemonName, genString) {
    // for generations excluding most recent
    var source = 'https://query.yahooapis.com/v1/public/';
    var query = 'select * from htmlstring where url="http://bulbapedia.bulbagarden.net/wiki/'
      + pokemonName.replace(' ', '_')
      + '_(Pokémon)/Generation_'
      + genString
      + '_learnset" and xpath=\'//*[@id="mw-content-text"]/table[1]/tbody/tr[2]/td/table\'';
    var env = "&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";

    return source + 'yql?q=' + encodeURI(query) + '&format=json' + env + '&callback=';
  };

  function createIndQueryUrl(individualUrl, xpath) {
    if (xpath == null) {
      xpath = '//*[@id="mw-content-text"]/table[1]/tbody/tr[2]/td/table';
    }

    var source = 'https://query.yahooapis.com/v1/public/';
    var query = 'select * from htmlstring where url="'
      + individualUrl
      + '" and xpath=\''
      + xpath
      + '\'';
    var env = "&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";

    return source + 'yql?q=' + encodeURI(query) + '&format=json' + env + '&callback=';
  };

  //====== remote data retrieval ========
  function ajaxRequestLearnsetTable(requestUrl, pokemon, isIndividual) {
    $.ajax({
        url: requestUrl,
        type: 'GET',
        dataType: 'json'
      })
      .done(function(res) {
        prepAndSendLearnsets(res, pokemon, isIndividual);
      });
  }

  function getAllLearnsets() {
    Learnset.get().then(function(res){
      $scope.learnsets = res.data;
    });
  };

  function getAssociatedData() {
    Generation.get().then(function(res){
      $scope.generations = res.data;
    });
    PokemonLearnset.get().then(function(res) {
      $scope.pokemonLearnsets = res.data;
    });
    Pokemon.get().then(function(res){
      $scope.pokemon = res.data;
    });
    Move.get().then(function(res){
      $scope.moves = res.data;
    });
    Game.get().then(function(res){
      $scope.games = res.data;
    });
  };

  //======= find entries by name string ========
  function generationIdByName(name) {
    for (var i = 0; i < $scope.generations.length; i++){
      if ($scope.generations[i].name == name){
        return $scope.generations[i].id
      }
    }
    return null;
  };

  function pokemonIdByName(name) {
    for (var i = 0; i < $scope.pokemon.length; i++){
      if ($scope.pokemon[i].name == name){
        return $scope.pokemon[i].id
      }
    }
    return null;
  };

  /**
   * Find move within moves table by name
   * Check move names without differences in spacing/punctuation/capitalization
   * @param  string name Name to find in existing moves table
   * @return string      ID of move
   */
  function moveIdByName(name, genId) {
    name = name.replace(/[^a-zA-Z0-9]*/g, '').toLowerCase();
    for (var i = 0; i < $scope.moves.length; i++){
      var move = $scope.moves[i];
      var n = move.name.replace(/[^a-zA-Z0-9]*/g, '').toLowerCase();
      // check generation range
      if (genId >= move.genIntroducedId && (genId <= move.genCompletedId || move.genCompletedId == null)) {
        if (n == name){
          return $scope.moves[i].id;
        }
        // special conditions
        else if (n == 'highjumpkick' && name == 'hijumpkick') {
          return $scope.moves[i].id;
        }
        else if (n == 'feintattack' && name == 'faintattack') {
          return $scope.moves[i].id;
        }
        else if (n = 'smellingsalts' && name == 'smellingsalt') {
          return $scope.moves[i].id;
        }
      }
    }
    console.error("no move id found", name);
    return null;
  };

};

},{"../../lib/tableToJson":17}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
module.exports = function ($scope) {
    $scope.message = 'Page not found!';
  };


},{}],15:[function(require,module,exports){
module.exports = function ($scope) {
    $scope.message = 'Everyone come and see how good I look!';
  };


},{}],16:[function(require,module,exports){
var DataStore = {

  getAllGenerations(Generations) {
    return Generations.get().then(function(res){
      return res.data;
    });
  },


}

module.exports = DataStore;
},{}],17:[function(require,module,exports){
/**
 * table-to-json
 * jQuery plugin that reads an HTML table and returns a javascript object representing the values and columns of the table
 *
 * @author Daniel White
 * @copyright Daniel White 2017
 * @license MIT <https://github.com/lightswitch05/table-to-json/blob/master/MIT-LICENSE>
 * @link https://github.com/lightswitch05/table-to-json
 * @module table-to-json
 * @version 0.11.1
 */
(function( $ ) {
  'use strict';

  $.fn.tableToJSON = function(opts) {

    // Set options
    var defaults = {
      ignoreColumns: [],
      onlyColumns: null,
      ignoreHiddenRows: true,
      ignoreEmptyRows: false,
      headings: null,
      allowHTML: false,
      includeRowId: false,
      textDataOverride: 'data-override',
      extractor: null,
      textExtractor: null
    };
    opts = $.extend(defaults, opts);

    var notNull = function(value) {
      return value !== undefined && value !== null;
    };

    var ignoredColumn = function(index) {
      if( notNull(opts.onlyColumns) ) {
        return $.inArray(index, opts.onlyColumns) === -1;
      }
      return $.inArray(index, opts.ignoreColumns) !== -1;
    };

    var arraysToHash = function(keys, values) {
      var result = {}, index = 0;
      $.each(values, function(i, value) {
        // when ignoring columns, the header option still starts
        // with the first defined column
        if ( index < keys.length && notNull(value) ) {
          result[ keys[index] ] = value;
          index++;
        }
      });
      return result;
    };

    var cellValues = function(cellIndex, cell, isHeader) {
      var $cell = $(cell),
        // extractor
        extractor = opts.extractor || opts.textExtractor,
        override = $cell.attr(opts.textDataOverride),
        value;
      // don't use extractor for header cells
      if ( extractor === null || isHeader ) {
        return $.trim( override || ( opts.allowHTML ? $cell.html() : cell.textContent || $cell.text() ) || '' );
      } else {
        // overall extractor function
        if ( $.isFunction(extractor) ) {
          value = override || extractor(cellIndex, $cell);
          return typeof value === 'string' ? $.trim( value ) : value;
        } else if ( typeof extractor === 'object' && $.isFunction( extractor[cellIndex] ) ) {
          value = override || extractor[cellIndex](cellIndex, $cell);
          return typeof value === 'string' ? $.trim( value ) : value;
        }
      }
      // fallback
      return $.trim( override || ( opts.allowHTML ? $cell.html() : cell.textContent || $cell.text() ) || '' );
    };

    var rowValues = function(row, isHeader) {
      var result = [];
      var includeRowId = opts.includeRowId;
      var useRowId = (typeof includeRowId === 'boolean') ? includeRowId : (typeof includeRowId === 'string') ? true : false;
      var rowIdName = (typeof includeRowId === 'string') === true ? includeRowId : 'rowId';
      if (useRowId) {
        if (typeof $(row).attr('id') === 'undefined') {
          result.push(rowIdName);
        }
      }
      $(row).children('td,th').each(function(cellIndex, cell) {
        result.push( cellValues(cellIndex, cell, isHeader) );
      });
      return result;
    };

    var getHeadings = function(table) {
      var firstRow = table.find('tr:first').first();
      return notNull(opts.headings) ? opts.headings : rowValues(firstRow, true);
    };

    var construct = function(table, headings) {
      var i, j, len, len2, txt, $row, $cell,
        tmpArray = [], cellIndex = 0, result = [];
      table.children('tbody,*').children('tr').each(function(rowIndex, row) {
        if( rowIndex > 0 || notNull(opts.headings) ) {
          var includeRowId = opts.includeRowId;
          var useRowId = (typeof includeRowId === 'boolean') ? includeRowId : (typeof includeRowId === 'string') ? true : false;

          $row = $(row);

          var isEmpty = ($row.find('td').length === $row.find('td:empty').length) ? true : false;

          if( ( $row.is(':visible') || !opts.ignoreHiddenRows ) && ( !isEmpty || !opts.ignoreEmptyRows ) && ( !$row.data('ignore') || $row.data('ignore') === 'false' ) ) {
            cellIndex = 0;
            if (!tmpArray[rowIndex]) {
              tmpArray[rowIndex] = [];
            }
            if (useRowId) {
              cellIndex = cellIndex + 1;
              if (typeof $row.attr('id') !== 'undefined') {
                tmpArray[rowIndex].push($row.attr('id'));
              } else {
                tmpArray[rowIndex].push('');
              }
            }

            $row.children().each(function(){
              $cell = $(this);
              // skip column if already defined
              while (tmpArray[rowIndex][cellIndex]) { cellIndex++; }

              // process rowspans
              if ($cell.filter('[rowspan]').length) {
                len = parseInt( $cell.attr('rowspan'), 10) - 1;
                txt = cellValues(cellIndex, $cell);
                for (i = 1; i <= len; i++) {
                  if (!tmpArray[rowIndex + i]) { tmpArray[rowIndex + i] = []; }
                  tmpArray[rowIndex + i][cellIndex] = txt;
                }
              }
              // process colspans
              if ($cell.filter('[colspan]').length) {
                len = parseInt( $cell.attr('colspan'), 10) - 1;
                txt = cellValues(cellIndex, $cell);
                for (i = 1; i <= len; i++) {
                  // cell has both col and row spans
                  if ($cell.filter('[rowspan]').length) {
                    len2 = parseInt( $cell.attr('rowspan'), 10);
                    for (j = 0; j < len2; j++) {
                      tmpArray[rowIndex + j][cellIndex + i] = txt;
                    }
                  } else {
                    tmpArray[rowIndex][cellIndex + i] = txt;
                  }
                }
              }

              txt = tmpArray[rowIndex][cellIndex] || cellValues(cellIndex, $cell);
              if (notNull(txt)) {
                tmpArray[rowIndex][cellIndex] = txt;
              }
              cellIndex++;
            });
          }
        }
      });
      $.each(tmpArray, function( i, row ){
        if (notNull(row)) {
          // remove ignoredColumns / add onlyColumns
          var newRow = notNull(opts.onlyColumns) || opts.ignoreColumns.length ?
            $.grep(row, function(v, index){ return !ignoredColumn(index); }) : row,

            // remove ignoredColumns / add onlyColumns if headings is not defined
            newHeadings = notNull(opts.headings) ? headings :
              $.grep(headings, function(v, index){ return !ignoredColumn(index); });

          txt = arraysToHash(newHeadings, newRow);
          result[result.length] = txt;
        }
      });
      return result;
    };

    // Run
    var headings = getHeadings(this);
    return construct(this, headings);
  };
})( jQuery );
},{}],18:[function(require,module,exports){
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

},{"./services/abilityService":19,"./services/abilitysetService":20,"./services/effectivenessService":21,"./services/evolutionService":22,"./services/gameService":23,"./services/generationService":24,"./services/itemService":25,"./services/learnsetService":26,"./services/moveService":27,"./services/pokemonService":28,"./services/typeService":29}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){
module.exports = function($http) {
  return {
    get: function() {
      return $http.get('/api/abilitysets');
    },
    bulkCreate: function(data) {
      return $http.post('/api/abilitysets/bulk', data);
    },
    delete: function(id) {
      return $http.delete('/api/abilitysets/' + id);
    }
  }
};

},{}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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

},{}],23:[function(require,module,exports){
module.exports = function($http) {
  return {
    get: function() {
      return $http.get('/api/games');
    },
    create: function(data) {
      return $http.post('/api/games', data);
    },
    delete: function(id) {
      return $http.delete('/api/games/' + id);
    }
  }
};

},{}],24:[function(require,module,exports){
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

},{}],25:[function(require,module,exports){
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

},{}],26:[function(require,module,exports){
module.exports = function($http) {
  return {
    get: function() {
      return $http.get('/api/learnsets');
    },
    create: function(data) {
      return $http.post('/api/learnsets', data);
    },
    bulkCreate: function(data) {
      return $http.post('/api/learnsets/bulk', data);
    },
    update: function(id, data) {
      return $http.put('/api/learnsets/' + id, data);
    },
    delete: function(id) {
      return $http.delete('/api/learnsets/' + id);
    }
  }
};

},{}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
module.exports = function($http) {
  return {
    get: function() {
      return $http.get('/api/pokemon');
    },
    getById: function(id) {
      return $http.get('/api/pokemon/' + id)
    },
    bulkCreate: function(data) {
      return $http.post('/api/pokemon/bulk', data);
    },
    delete: function(id) {
      return $http.delete('/api/pokemon/' + id);
    }
  }
};

},{}],29:[function(require,module,exports){
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

},{}],30:[function(require,module,exports){
"use strict";

// rawAsap provides everything we need except exception management.
var rawAsap = require("./raw");
// RawTasks are recycled to reduce GC churn.
var freeTasks = [];
// We queue errors to ensure they are thrown in right order (FIFO).
// Array-as-queue is good enough here, since we are just dealing with exceptions.
var pendingErrors = [];
var requestErrorThrow = rawAsap.makeRequestCallFromTimer(throwFirstError);

function throwFirstError() {
    if (pendingErrors.length) {
        throw pendingErrors.shift();
    }
}

/**
 * Calls a task as soon as possible after returning, in its own event, with priority
 * over other events like animation, reflow, and repaint. An error thrown from an
 * event will not interrupt, nor even substantially slow down the processing of
 * other events, but will be rather postponed to a lower priority event.
 * @param {{call}} task A callable object, typically a function that takes no
 * arguments.
 */
module.exports = asap;
function asap(task) {
    var rawTask;
    if (freeTasks.length) {
        rawTask = freeTasks.pop();
    } else {
        rawTask = new RawTask();
    }
    rawTask.task = task;
    rawAsap(rawTask);
}

// We wrap tasks with recyclable task objects.  A task object implements
// `call`, just like a function.
function RawTask() {
    this.task = null;
}

// The sole purpose of wrapping the task is to catch the exception and recycle
// the task object after its single use.
RawTask.prototype.call = function () {
    try {
        this.task.call();
    } catch (error) {
        if (asap.onerror) {
            // This hook exists purely for testing purposes.
            // Its name will be periodically randomized to break any code that
            // depends on its existence.
            asap.onerror(error);
        } else {
            // In a web browser, exceptions are not fatal. However, to avoid
            // slowing down the queue of pending tasks, we rethrow the error in a
            // lower priority turn.
            pendingErrors.push(error);
            requestErrorThrow();
        }
    } finally {
        this.task = null;
        freeTasks[freeTasks.length] = this;
    }
};

},{"./raw":31}],31:[function(require,module,exports){
(function (global){
"use strict";

// Use the fastest means possible to execute a task in its own turn, with
// priority over other events including IO, animation, reflow, and redraw
// events in browsers.
//
// An exception thrown by a task will permanently interrupt the processing of
// subsequent tasks. The higher level `asap` function ensures that if an
// exception is thrown by a task, that the task queue will continue flushing as
// soon as possible, but if you use `rawAsap` directly, you are responsible to
// either ensure that no exceptions are thrown from your task, or to manually
// call `rawAsap.requestFlush` if an exception is thrown.
module.exports = rawAsap;
function rawAsap(task) {
    if (!queue.length) {
        requestFlush();
        flushing = true;
    }
    // Equivalent to push, but avoids a function call.
    queue[queue.length] = task;
}

var queue = [];
// Once a flush has been requested, no further calls to `requestFlush` are
// necessary until the next `flush` completes.
var flushing = false;
// `requestFlush` is an implementation-specific method that attempts to kick
// off a `flush` event as quickly as possible. `flush` will attempt to exhaust
// the event queue before yielding to the browser's own event loop.
var requestFlush;
// The position of the next task to execute in the task queue. This is
// preserved between calls to `flush` so that it can be resumed if
// a task throws an exception.
var index = 0;
// If a task schedules additional tasks recursively, the task queue can grow
// unbounded. To prevent memory exhaustion, the task queue will periodically
// truncate already-completed tasks.
var capacity = 1024;

// The flush function processes all tasks that have been scheduled with
// `rawAsap` unless and until one of those tasks throws an exception.
// If a task throws an exception, `flush` ensures that its state will remain
// consistent and will resume where it left off when called again.
// However, `flush` does not make any arrangements to be called again if an
// exception is thrown.
function flush() {
    while (index < queue.length) {
        var currentIndex = index;
        // Advance the index before calling the task. This ensures that we will
        // begin flushing on the next task the task throws an error.
        index = index + 1;
        queue[currentIndex].call();
        // Prevent leaking memory for long chains of recursive calls to `asap`.
        // If we call `asap` within tasks scheduled by `asap`, the queue will
        // grow, but to avoid an O(n) walk for every task we execute, we don't
        // shift tasks off the queue after they have been executed.
        // Instead, we periodically shift 1024 tasks off the queue.
        if (index > capacity) {
            // Manually shift all values starting at the index back to the
            // beginning of the queue.
            for (var scan = 0, newLength = queue.length - index; scan < newLength; scan++) {
                queue[scan] = queue[scan + index];
            }
            queue.length -= index;
            index = 0;
        }
    }
    queue.length = 0;
    index = 0;
    flushing = false;
}

// `requestFlush` is implemented using a strategy based on data collected from
// every available SauceLabs Selenium web driver worker at time of writing.
// https://docs.google.com/spreadsheets/d/1mG-5UYGup5qxGdEMWkhP6BWCz053NUb2E1QoUTU16uA/edit#gid=783724593

// Safari 6 and 6.1 for desktop, iPad, and iPhone are the only browsers that
// have WebKitMutationObserver but not un-prefixed MutationObserver.
// Must use `global` or `self` instead of `window` to work in both frames and web
// workers. `global` is a provision of Browserify, Mr, Mrs, or Mop.

/* globals self */
var scope = typeof global !== "undefined" ? global : self;
var BrowserMutationObserver = scope.MutationObserver || scope.WebKitMutationObserver;

// MutationObservers are desirable because they have high priority and work
// reliably everywhere they are implemented.
// They are implemented in all modern browsers.
//
// - Android 4-4.3
// - Chrome 26-34
// - Firefox 14-29
// - Internet Explorer 11
// - iPad Safari 6-7.1
// - iPhone Safari 7-7.1
// - Safari 6-7
if (typeof BrowserMutationObserver === "function") {
    requestFlush = makeRequestCallFromMutationObserver(flush);

// MessageChannels are desirable because they give direct access to the HTML
// task queue, are implemented in Internet Explorer 10, Safari 5.0-1, and Opera
// 11-12, and in web workers in many engines.
// Although message channels yield to any queued rendering and IO tasks, they
// would be better than imposing the 4ms delay of timers.
// However, they do not work reliably in Internet Explorer or Safari.

// Internet Explorer 10 is the only browser that has setImmediate but does
// not have MutationObservers.
// Although setImmediate yields to the browser's renderer, it would be
// preferrable to falling back to setTimeout since it does not have
// the minimum 4ms penalty.
// Unfortunately there appears to be a bug in Internet Explorer 10 Mobile (and
// Desktop to a lesser extent) that renders both setImmediate and
// MessageChannel useless for the purposes of ASAP.
// https://github.com/kriskowal/q/issues/396

// Timers are implemented universally.
// We fall back to timers in workers in most engines, and in foreground
// contexts in the following browsers.
// However, note that even this simple case requires nuances to operate in a
// broad spectrum of browsers.
//
// - Firefox 3-13
// - Internet Explorer 6-9
// - iPad Safari 4.3
// - Lynx 2.8.7
} else {
    requestFlush = makeRequestCallFromTimer(flush);
}

// `requestFlush` requests that the high priority event queue be flushed as
// soon as possible.
// This is useful to prevent an error thrown in a task from stalling the event
// queue if the exception handled by Node.js’s
// `process.on("uncaughtException")` or by a domain.
rawAsap.requestFlush = requestFlush;

// To request a high priority event, we induce a mutation observer by toggling
// the text of a text node between "1" and "-1".
function makeRequestCallFromMutationObserver(callback) {
    var toggle = 1;
    var observer = new BrowserMutationObserver(callback);
    var node = document.createTextNode("");
    observer.observe(node, {characterData: true});
    return function requestCall() {
        toggle = -toggle;
        node.data = toggle;
    };
}

// The message channel technique was discovered by Malte Ubl and was the
// original foundation for this library.
// http://www.nonblocking.io/2011/06/windownexttick.html

// Safari 6.0.5 (at least) intermittently fails to create message ports on a
// page's first load. Thankfully, this version of Safari supports
// MutationObservers, so we don't need to fall back in that case.

// function makeRequestCallFromMessageChannel(callback) {
//     var channel = new MessageChannel();
//     channel.port1.onmessage = callback;
//     return function requestCall() {
//         channel.port2.postMessage(0);
//     };
// }

// For reasons explained above, we are also unable to use `setImmediate`
// under any circumstances.
// Even if we were, there is another bug in Internet Explorer 10.
// It is not sufficient to assign `setImmediate` to `requestFlush` because
// `setImmediate` must be called *by name* and therefore must be wrapped in a
// closure.
// Never forget.

// function makeRequestCallFromSetImmediate(callback) {
//     return function requestCall() {
//         setImmediate(callback);
//     };
// }

// Safari 6.0 has a problem where timers will get lost while the user is
// scrolling. This problem does not impact ASAP because Safari 6.0 supports
// mutation observers, so that implementation is used instead.
// However, if we ever elect to use timers in Safari, the prevalent work-around
// is to add a scroll event listener that calls for a flush.

// `setTimeout` does not call the passed callback if the delay is less than
// approximately 7 in web workers in Firefox 8 through 18, and sometimes not
// even then.

function makeRequestCallFromTimer(callback) {
    return function requestCall() {
        // We dispatch a timeout with a specified delay of 0 for engines that
        // can reliably accommodate that request. This will usually be snapped
        // to a 4 milisecond delay, but once we're flushing, there's no delay
        // between events.
        var timeoutHandle = setTimeout(handleTimer, 0);
        // However, since this timer gets frequently dropped in Firefox
        // workers, we enlist an interval handle that will try to fire
        // an event 20 times per second until it succeeds.
        var intervalHandle = setInterval(handleTimer, 50);

        function handleTimer() {
            // Whichever timer succeeds will cancel both timers and
            // execute the callback.
            clearTimeout(timeoutHandle);
            clearInterval(intervalHandle);
            callback();
        }
    };
}

// This is for `asap.js` only.
// Its name will be periodically randomized to break any code that depends on
// its existence.
rawAsap.makeRequestCallFromTimer = makeRequestCallFromTimer;

// ASAP was originally a nextTick shim included in Q. This was factored out
// into this ASAP package. It was later adapted to RSVP which made further
// amendments. These decisions, particularly to marginalize MessageChannel and
// to capture the MutationObserver implementation in a closure, were integrated
// back into ASAP proper.
// https://github.com/tildeio/rsvp.js/blob/cddf7232546a9cf858524b75cde6f9edf72620a7/lib/rsvp/asap.js

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],32:[function(require,module,exports){
'use strict';

module.exports = require('./lib')

},{"./lib":37}],33:[function(require,module,exports){
'use strict';

var asap = require('asap/raw');

function noop() {}

// States:
//
// 0 - pending
// 1 - fulfilled with _value
// 2 - rejected with _value
// 3 - adopted the state of another promise, _value
//
// once the state is no longer pending (0) it is immutable

// All `_` prefixed properties will be reduced to `_{random number}`
// at build time to obfuscate them and discourage their use.
// We don't use symbols or Object.defineProperty to fully hide them
// because the performance isn't good enough.


// to avoid using try/catch inside critical functions, we
// extract them to here.
var LAST_ERROR = null;
var IS_ERROR = {};
function getThen(obj) {
  try {
    return obj.then;
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}

function tryCallOne(fn, a) {
  try {
    return fn(a);
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}
function tryCallTwo(fn, a, b) {
  try {
    fn(a, b);
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}

module.exports = Promise;

function Promise(fn) {
  if (typeof this !== 'object') {
    throw new TypeError('Promises must be constructed via new');
  }
  if (typeof fn !== 'function') {
    throw new TypeError('Promise constructor\'s argument is not a function');
  }
  this._75 = 0;
  this._83 = 0;
  this._18 = null;
  this._38 = null;
  if (fn === noop) return;
  doResolve(fn, this);
}
Promise._47 = null;
Promise._71 = null;
Promise._44 = noop;

Promise.prototype.then = function(onFulfilled, onRejected) {
  if (this.constructor !== Promise) {
    return safeThen(this, onFulfilled, onRejected);
  }
  var res = new Promise(noop);
  handle(this, new Handler(onFulfilled, onRejected, res));
  return res;
};

function safeThen(self, onFulfilled, onRejected) {
  return new self.constructor(function (resolve, reject) {
    var res = new Promise(noop);
    res.then(resolve, reject);
    handle(self, new Handler(onFulfilled, onRejected, res));
  });
}
function handle(self, deferred) {
  while (self._83 === 3) {
    self = self._18;
  }
  if (Promise._47) {
    Promise._47(self);
  }
  if (self._83 === 0) {
    if (self._75 === 0) {
      self._75 = 1;
      self._38 = deferred;
      return;
    }
    if (self._75 === 1) {
      self._75 = 2;
      self._38 = [self._38, deferred];
      return;
    }
    self._38.push(deferred);
    return;
  }
  handleResolved(self, deferred);
}

function handleResolved(self, deferred) {
  asap(function() {
    var cb = self._83 === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      if (self._83 === 1) {
        resolve(deferred.promise, self._18);
      } else {
        reject(deferred.promise, self._18);
      }
      return;
    }
    var ret = tryCallOne(cb, self._18);
    if (ret === IS_ERROR) {
      reject(deferred.promise, LAST_ERROR);
    } else {
      resolve(deferred.promise, ret);
    }
  });
}
function resolve(self, newValue) {
  // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
  if (newValue === self) {
    return reject(
      self,
      new TypeError('A promise cannot be resolved with itself.')
    );
  }
  if (
    newValue &&
    (typeof newValue === 'object' || typeof newValue === 'function')
  ) {
    var then = getThen(newValue);
    if (then === IS_ERROR) {
      return reject(self, LAST_ERROR);
    }
    if (
      then === self.then &&
      newValue instanceof Promise
    ) {
      self._83 = 3;
      self._18 = newValue;
      finale(self);
      return;
    } else if (typeof then === 'function') {
      doResolve(then.bind(newValue), self);
      return;
    }
  }
  self._83 = 1;
  self._18 = newValue;
  finale(self);
}

function reject(self, newValue) {
  self._83 = 2;
  self._18 = newValue;
  if (Promise._71) {
    Promise._71(self, newValue);
  }
  finale(self);
}
function finale(self) {
  if (self._75 === 1) {
    handle(self, self._38);
    self._38 = null;
  }
  if (self._75 === 2) {
    for (var i = 0; i < self._38.length; i++) {
      handle(self, self._38[i]);
    }
    self._38 = null;
  }
}

function Handler(onFulfilled, onRejected, promise){
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, promise) {
  var done = false;
  var res = tryCallTwo(fn, function (value) {
    if (done) return;
    done = true;
    resolve(promise, value);
  }, function (reason) {
    if (done) return;
    done = true;
    reject(promise, reason);
  });
  if (!done && res === IS_ERROR) {
    done = true;
    reject(promise, LAST_ERROR);
  }
}

},{"asap/raw":31}],34:[function(require,module,exports){
'use strict';

var Promise = require('./core.js');

module.exports = Promise;
Promise.prototype.done = function (onFulfilled, onRejected) {
  var self = arguments.length ? this.then.apply(this, arguments) : this;
  self.then(null, function (err) {
    setTimeout(function () {
      throw err;
    }, 0);
  });
};

},{"./core.js":33}],35:[function(require,module,exports){
'use strict';

//This file contains the ES6 extensions to the core Promises/A+ API

var Promise = require('./core.js');

module.exports = Promise;

/* Static Functions */

var TRUE = valuePromise(true);
var FALSE = valuePromise(false);
var NULL = valuePromise(null);
var UNDEFINED = valuePromise(undefined);
var ZERO = valuePromise(0);
var EMPTYSTRING = valuePromise('');

function valuePromise(value) {
  var p = new Promise(Promise._44);
  p._83 = 1;
  p._18 = value;
  return p;
}
Promise.resolve = function (value) {
  if (value instanceof Promise) return value;

  if (value === null) return NULL;
  if (value === undefined) return UNDEFINED;
  if (value === true) return TRUE;
  if (value === false) return FALSE;
  if (value === 0) return ZERO;
  if (value === '') return EMPTYSTRING;

  if (typeof value === 'object' || typeof value === 'function') {
    try {
      var then = value.then;
      if (typeof then === 'function') {
        return new Promise(then.bind(value));
      }
    } catch (ex) {
      return new Promise(function (resolve, reject) {
        reject(ex);
      });
    }
  }
  return valuePromise(value);
};

Promise.all = function (arr) {
  var args = Array.prototype.slice.call(arr);

  return new Promise(function (resolve, reject) {
    if (args.length === 0) return resolve([]);
    var remaining = args.length;
    function res(i, val) {
      if (val && (typeof val === 'object' || typeof val === 'function')) {
        if (val instanceof Promise && val.then === Promise.prototype.then) {
          while (val._83 === 3) {
            val = val._18;
          }
          if (val._83 === 1) return res(i, val._18);
          if (val._83 === 2) reject(val._18);
          val.then(function (val) {
            res(i, val);
          }, reject);
          return;
        } else {
          var then = val.then;
          if (typeof then === 'function') {
            var p = new Promise(then.bind(val));
            p.then(function (val) {
              res(i, val);
            }, reject);
            return;
          }
        }
      }
      args[i] = val;
      if (--remaining === 0) {
        resolve(args);
      }
    }
    for (var i = 0; i < args.length; i++) {
      res(i, args[i]);
    }
  });
};

Promise.reject = function (value) {
  return new Promise(function (resolve, reject) {
    reject(value);
  });
};

Promise.race = function (values) {
  return new Promise(function (resolve, reject) {
    values.forEach(function(value){
      Promise.resolve(value).then(resolve, reject);
    });
  });
};

/* Prototype Methods */

Promise.prototype['catch'] = function (onRejected) {
  return this.then(null, onRejected);
};

},{"./core.js":33}],36:[function(require,module,exports){
'use strict';

var Promise = require('./core.js');

module.exports = Promise;
Promise.prototype['finally'] = function (f) {
  return this.then(function (value) {
    return Promise.resolve(f()).then(function () {
      return value;
    });
  }, function (err) {
    return Promise.resolve(f()).then(function () {
      throw err;
    });
  });
};

},{"./core.js":33}],37:[function(require,module,exports){
'use strict';

module.exports = require('./core.js');
require('./done.js');
require('./finally.js');
require('./es6-extensions.js');
require('./node-extensions.js');
require('./synchronous.js');

},{"./core.js":33,"./done.js":34,"./es6-extensions.js":35,"./finally.js":36,"./node-extensions.js":38,"./synchronous.js":39}],38:[function(require,module,exports){
'use strict';

// This file contains then/promise specific extensions that are only useful
// for node.js interop

var Promise = require('./core.js');
var asap = require('asap');

module.exports = Promise;

/* Static Functions */

Promise.denodeify = function (fn, argumentCount) {
  if (
    typeof argumentCount === 'number' && argumentCount !== Infinity
  ) {
    return denodeifyWithCount(fn, argumentCount);
  } else {
    return denodeifyWithoutCount(fn);
  }
};

var callbackFn = (
  'function (err, res) {' +
  'if (err) { rj(err); } else { rs(res); }' +
  '}'
);
function denodeifyWithCount(fn, argumentCount) {
  var args = [];
  for (var i = 0; i < argumentCount; i++) {
    args.push('a' + i);
  }
  var body = [
    'return function (' + args.join(',') + ') {',
    'var self = this;',
    'return new Promise(function (rs, rj) {',
    'var res = fn.call(',
    ['self'].concat(args).concat([callbackFn]).join(','),
    ');',
    'if (res &&',
    '(typeof res === "object" || typeof res === "function") &&',
    'typeof res.then === "function"',
    ') {rs(res);}',
    '});',
    '};'
  ].join('');
  return Function(['Promise', 'fn'], body)(Promise, fn);
}
function denodeifyWithoutCount(fn) {
  var fnLength = Math.max(fn.length - 1, 3);
  var args = [];
  for (var i = 0; i < fnLength; i++) {
    args.push('a' + i);
  }
  var body = [
    'return function (' + args.join(',') + ') {',
    'var self = this;',
    'var args;',
    'var argLength = arguments.length;',
    'if (arguments.length > ' + fnLength + ') {',
    'args = new Array(arguments.length + 1);',
    'for (var i = 0; i < arguments.length; i++) {',
    'args[i] = arguments[i];',
    '}',
    '}',
    'return new Promise(function (rs, rj) {',
    'var cb = ' + callbackFn + ';',
    'var res;',
    'switch (argLength) {',
    args.concat(['extra']).map(function (_, index) {
      return (
        'case ' + (index) + ':' +
        'res = fn.call(' + ['self'].concat(args.slice(0, index)).concat('cb').join(',') + ');' +
        'break;'
      );
    }).join(''),
    'default:',
    'args[argLength] = cb;',
    'res = fn.apply(self, args);',
    '}',
    
    'if (res &&',
    '(typeof res === "object" || typeof res === "function") &&',
    'typeof res.then === "function"',
    ') {rs(res);}',
    '});',
    '};'
  ].join('');

  return Function(
    ['Promise', 'fn'],
    body
  )(Promise, fn);
}

Promise.nodeify = function (fn) {
  return function () {
    var args = Array.prototype.slice.call(arguments);
    var callback =
      typeof args[args.length - 1] === 'function' ? args.pop() : null;
    var ctx = this;
    try {
      return fn.apply(this, arguments).nodeify(callback, ctx);
    } catch (ex) {
      if (callback === null || typeof callback == 'undefined') {
        return new Promise(function (resolve, reject) {
          reject(ex);
        });
      } else {
        asap(function () {
          callback.call(ctx, ex);
        })
      }
    }
  }
};

Promise.prototype.nodeify = function (callback, ctx) {
  if (typeof callback != 'function') return this;

  this.then(function (value) {
    asap(function () {
      callback.call(ctx, null, value);
    });
  }, function (err) {
    asap(function () {
      callback.call(ctx, err);
    });
  });
};

},{"./core.js":33,"asap":30}],39:[function(require,module,exports){
'use strict';

var Promise = require('./core.js');

module.exports = Promise;
Promise.enableSynchronous = function () {
  Promise.prototype.isPending = function() {
    return this.getState() == 0;
  };

  Promise.prototype.isFulfilled = function() {
    return this.getState() == 1;
  };

  Promise.prototype.isRejected = function() {
    return this.getState() == 2;
  };

  Promise.prototype.getValue = function () {
    if (this._83 === 3) {
      return this._18.getValue();
    }

    if (!this.isFulfilled()) {
      throw new Error('Cannot get a value of an unfulfilled promise.');
    }

    return this._18;
  };

  Promise.prototype.getReason = function () {
    if (this._83 === 3) {
      return this._18.getReason();
    }

    if (!this.isRejected()) {
      throw new Error('Cannot get a rejection reason of a non-rejected promise.');
    }

    return this._18;
  };

  Promise.prototype.getState = function () {
    if (this._83 === 3) {
      return this._18.getState();
    }
    if (this._83 === -1 || this._83 === -2) {
      return 0;
    }

    return this._83;
  };
};

Promise.disableSynchronous = function() {
  Promise.prototype.isPending = undefined;
  Promise.prototype.isFulfilled = undefined;
  Promise.prototype.isRejected = undefined;
  Promise.prototype.getValue = undefined;
  Promise.prototype.getReason = undefined;
  Promise.prototype.getState = undefined;
};

},{"./core.js":33}]},{},[1]);
