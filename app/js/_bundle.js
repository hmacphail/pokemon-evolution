(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
homeController          = require('./controllers/homeController');
errorController         = require('./controllers/errorController');
generationController    = require('./controllers/admin/generationController');
pokemonController       = require('./controllers/admin/pokemonController');
evolutionController     = require('./controllers/admin/evolutionController');
typeController          = require('./controllers/admin/typeController');
effectivenessController = require('./controllers/admin/effectivenessController');
abilityController       = require('./controllers/admin/abilityController');
abilitysetController    = require('./controllers/admin/abilitysetController');
moveController          = require('./controllers/admin/moveController');
learnsetController      = require('./controllers/admin/learnsetController');
itemController          = require('./controllers/admin/itemController');
gameController          = require('./controllers/admin/gameController');

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
DataStore = require('../../lib/data-store');

module.exports = function ($scope, Abilities, Generations) {

  $scope.formData = {};
  $scope.dataStore = new DataStore();

  $scope.dataStore.getAbilities(Abilities);
  $scope.dataStore.getGenerations(Generations);

  $scope.createAbilitiesBulk = function() {
    Abilities.bulkCreate(parseBulkData($scope.formData))
      .then((res) => {
        if (res.status == 200) {
          $scope.formData = {};
          $scope.dataStore.getAbilities(Abilities);
        }
      });
  }

  $scope.deleteAbility = function(id) {
    Abilities.delete(id)
      .then((res) => {
        $scope.dataStore.getAbilities(Abilities);
      });
  }

  function parseBulkData(inputData) {
    // parse pasted data from bulbapedia table
    // http://bulbapedia.bulbagarden.net/wiki/Ability#List_of_Abilities
    let abilities = [];
    inputData.bulk.split('\n').forEach((a) => {
      const ability = a.split('\t');
      abilities.push({
        "name" : ability[1],
        "description" : ability[2],
        "genIntroducedId" : $scope.dataStore.getGenerationIdByName(ability[3])
      });
    });
    return abilities;
  }

};

},{"../../lib/data-store":16}],4:[function(require,module,exports){
DataStore = require('../../lib/data-store');

module.exports = function ($scope, Abilitysets, Generations, Pokemon, Abilities) {

  $scope.formData = {};
  $scope.dataStore = new DataStore();

  $scope.dataStore.getAbilitysets(Abilitysets);
  $scope.dataStore.getGenerations(Generations);
  $scope.dataStore.getPokemon(Pokemon);
  $scope.dataStore.getAbilities(Abilities);

  $scope.createAbilitysetsBulk = function() {
    Abilitysets.bulkCreate(parseBulkData($scope.formData))
      .then((res) => {
        if (res.status == 200) {
          $scope.formData = {};
          $scope.dataStore.getAbilitysets(Abilitysets);
        }
      });
  }

  $scope.deleteAbilityset = function(id) {
    Abilitysets.delete(id)
      .then((res) => {
        $scope.dataStore.getAbilitysets(Abilitysets);
      });
  }

  $scope.pokemonName = function(pokemonId) {
    $scope.dataStore.getPokemonNameById(pokemonId);
  }

  $scope.abilityName = function(abilityId) {
    $scope.dataStore.getAbilityNameById(abilityId);
  }


  // --- helper functions ---

  function parseBulkData(inputData) {
    // parse pasted data from bulbapedia table
    // http://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_Ability
    let abilitysets = [];
    //let prevName = "";
    inputData.bulk.split('\n').forEach((a) => {
      let as = a.split('\t');
      // if spaces instead of tab character
      if (as.length == 1) {
        as = as[0].split('   ');
        as.forEach((a, i) => {
          as[i] = a.trim();
        });
      }

      // find duplicate rows of the same pokemon
      //if (as[2].replace('*', '').includes(prevName.replace('*', ''))) {
      //  console.log(as[2]);
      //}
      //else {
      const pokeIds = pokemonIdsByName(as[2], as[1]);

      // use pokemon's gen if no gen provided
      // only need to check first pokemonId as should all be same gen
      const genIntro = as[6] || getGenerationByPokemonId(pokeIds[0]);
      const genCompl = as[7] || null;

      if (as[3] && (!inputData.includeStarred && as[3].indexOf('*') < 0 ||
        inputData.includeStarred && as[3].indexOf('*') >= 0)) {
        // primary ability
        createAbilitysetObjs(pokeIds, $scope.dataStore.getAbilityIdByName(as[3]), "primary", genIntro, genCompl).forEach((as) => {
          abilitysets.push(as);
        });
      }
      if (as[4] && (!inputData.includeStarred && as[4].indexOf('*') < 0 ||
        inputData.includeStarred && as[4].indexOf('*') >= 0)) {
        // secondary ability
        createAbilitysetObjs(pokeIds, $scope.dataStore.getAbilityIdByName(as[4]), "secondary", genIntro, genCompl).forEach((as) => {
          abilitysets.push(as);
        });
      }
      if (as[5] && (!inputData.includeStarred && as[5].indexOf('*') < 0 ||
        inputData.includeStarred && as[5].indexOf('*') >= 0)) {
        // hidden ability
        createAbilitysetObjs(pokeIds, $scope.dataStore.getAbilityIdByName(as[5]), "hidden", genIntro, genCompl).forEach((as) => {
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

    let as = [];
    for (let i = 0; i < pokemonIds.length; i++) {
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

  //======= find data entries ========
  function pokemonIdsByName(name, variation) {
    name = name.replace('*', '');
    let pm = [];
    const isAlolan = (name.indexOf('Alolan') >= 0);
    if (isAlolan) {
      name = name.split(' ')[1];
    }
    for (let i = 0; i < $scope.dataStore.pokemon.length; i++){
      const p = $scope.dataStore.pokemon[i];

      // check that name matches
      if (p.name == name){

        // check that isAlolan if required
        if ((!isAlolan && p.form != 'alolan') || (isAlolan && p.form == 'alolan')) {

          // check that variation matches if required (unless mega)
          if (variation == name || p.form == 'mega' || p.variation == variation) {
            pm.push(p.id);
          }
        }
      }
    }

    return pm;
  }

  function getGenerationByPokemonId(pokemonId) {
    for (let i = 0; i < $scope.dataStore.pokemon.length; i++){
      if ($scope.dataStore.pokemon[i].id == pokemonId){
        return $scope.dataStore.pokemon[i].genIntroducedId;
      }
    }
  }

};

},{"../../lib/data-store":16}],5:[function(require,module,exports){
DataStore = require('../../lib/data-store');

module.exports = function ($scope, Effectiveness, Generations, Types) {

  $scope.formData = {};
  $scope.dataStore = new DataStore();

  $scope.dataStore.getEffectiveness(Effectiveness);
  $scope.dataStore.getGenerations(Generations);
  $scope.dataStore.getTypes(Types);

  $scope.createEffectivenessBulk = function() {
    // prep data to send
    Effectiveness.bulkCreate(checkBulkForDuplicates(parseBulkData($scope.formData)))
      .then((res) => {
        if (res.status == 200) {
          $scope.formData = {};
          $scope.dataStore.getEffectiveness(Effectiveness);
        }
      });
  }

  $scope.deleteEffectiveness = function(id) {
    Effectiveness.delete(id)
      .then((res) => {
        $scope.dataStore.getEffectiveness(Effectiveness);
      });
  }


  // --- helper functions ---

  function parseBulkData(inputData) {
    // parse pasted data from bulbapedia table
    // http://bulbapedia.bulbagarden.net/wiki/Type/Type_chart
    const effects = inputData.bulk.split('\n');

    let effectiveness = [];
    for (let ii = 0; ii < effects.length; ii++) {
      const e = effects[ii].split('\t');
      const attType = $scope.dataStore.getTypeIdByName(e[0]);

      for (let jj = 0; jj < effects.length; jj++) {
        const defType = $scope.dataStore.getTypeIdByName(effects[jj].substr(0, effects[jj].indexOf('\t')));
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
    let bulkDataToSend = [];
    dataToCheck.forEach((newEffect) => {
      // add every object to send array
      bulkDataToSend.push(newEffect);

      for(let i = 0; i < $scope.dataStore.effectiveness.length; i++) {
        const oldEffect = $scope.dataStore.effectiveness[i];

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

},{"../../lib/data-store":16}],6:[function(require,module,exports){
DataStore = require('../../lib/data-store');

module.exports = function ($scope, Evolutions, Pokemon, Items) {

  $scope.formData = {};
  $scope.triggers = ['level', 'item', 'trade', 'happiness', 'other'];
  $scope.dataStore = new DataStore();

  $scope.dataStore.getEvolutions(Evolutions);
  $scope.dataStore.getPokemon(Pokemon);
  $scope.dataStore.getItems(Items);

  $scope.createEvolutionsBulk = function() {
    if ($scope.formData.trigger) {
      Evolutions.bulkCreate(parseBulkData($scope.formData))
        .then((res) => {
          if (res.status == 200) {
            $scope.formData = {};
            $scope.dataStore.getEvolutions(Evolutions);
          }
        });
    }
  }

  $scope.deleteEvolution = function(id) {
    Evolutions.delete(id)
      .then((res) => {
        $scope.dataStore.getEvolutions(Evolutions);
      });
  }

  $scope.pokemonName = function(pokemonId) {
    $scope.dataStore.getPokemonNameById(pokemonId);
  }

  $scope.itemName = function(itemId) {
    $scope.dataStore.getItemNameById(itemId);
  }

  //======= main parser functions ========
  function parseBulkData(inputData) {
    // parse pasted data from evolutions tables
    // https://pokemondb.net/evolution/level
    let evolutions = [];
    let prev = [];

    inputData.bulk.split('\n').forEach((e) => {
      const evo = e.split('\t');

      if (evo.length <= 3 ) { // dual row data entry
        if (evo.length == 1) {
          // unnecessary duplicate row -- do nothing
        }
        else if (prev.length == 0) { // first row
          prev = evo;
        }
        else { // second row
          const evs = parseDataRow(inputData.trigger, prev, evo);
          evs.forEach((e) => {
            evolutions.push(e);
          });
          prev = [];
        }
      }
      else { // regular data row
        const evs = parseDataRow(inputData.trigger, evo);
        evs.forEach((e) => {
          evolutions.push(e);
        });
      }
    });
    if (prev.length != 0) { // missed last entry
      const evs = parseDataRow(inputData.trigger, prev);
      evs.forEach((e) => {
        evolutions.push(e);
      });
    }

    console.log(evolutions);
    return evolutions;
  }

  function parseDataRow(trigger, row1, row2) {
    if (row2) { // dual row data entry
      const variation = checkSpecialCondition(row1[2]) ? row2[0] : null;

      const frmPoke = checkAlolan(row1[0])
          ? pokemonObjsByName(splitPokemonNameString(row1[0].split(' ')[1]), variation, true)
          : pokemonObjsByName(splitPokemonNameString(row1[0]), variation, false);
      const toPoke = checkAlolan(row1[2])
          ? pokemonObjsByName(splitPokemonNameString(row1[2].split(' ')[1]), variation, true)
          : pokemonObjsByName(splitPokemonNameString(row1[2].split(' ')[0]), variation, false);

      switch (trigger) {
        case 'level' :
          return createEvolutionObjs(frmPoke, toPoke, row2[2], row2[1], null);
        case 'item' :
          const itemCond = splitItemConditionString(row2[1]);
          return createEvolutionObjs(frmPoke, toPoke, itemCond[1], null, $scope.dataStore.getItemIdByName(itemCond[0]));
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
      const frmPoke = pokemonObjsByName(splitPokemonNameString(row1[0]));
      const toPoke = pokemonObjsByName(splitPokemonNameString(row1[2]));

      switch (trigger) {
        case 'level' :
          return createEvolutionObjs(frmPoke, toPoke, row1[4], row1[3], null);
        case 'item' :
          const itemCond = splitItemConditionString(row1[3]);
          return createEvolutionObjs(frmPoke, toPoke, itemCond[1], null, $scope.dataStore.getItemIdByName(itemCond[0]));
        case 'trade' :
          const item = $scope.dataStore.getItemIdByName(row1[3]);
          const cond = item ? null : row1[3];
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
    let evs = [];
    for (let f = 0; f < fromPokemon.length; f++) {
      for (let t = 0; t < toPokemon.length; t++) {
        const from = fromPokemon[f];
        const to = toPokemon[t];
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
  }

  function splitPokemonNameString(inputStr) {
    const len = inputStr.length;
    const firstHalf = inputStr.substr(0, len/2);
    const secondHalf = inputStr.substr(len/2, len/2);

    if (firstHalf === secondHalf)
      return firstHalf;
    else
      return inputStr;
  }

  function checkSpecialCondition(inputStr) {
    return inputStr.indexOf('(') >= 0;
  }

  function checkAlolan(inputStr) {
    return inputStr.split(' ')[0] === "Alolan";
  }

  //---- data parsing for item trigger ----
  function splitItemConditionString(inputStr) {
    const bracketInd = inputStr.indexOf('(');
    if (bracketInd >= 0) {
      const item = inputStr.substring(0, bracketInd).trim();
      const condition = inputStr.substring(bracketInd + 1, inputStr.indexOf(')'));
      return [item, condition];
    }
    return [inputStr];
  }

  //======= find entries by name string ========
  function pokemonObjsByName(name, variation, isAlolan) {
    let pm = [];
    for (let i = 0; i < $scope.dataStore.pokemon.length; i++){
      const p = $scope.dataStore.pokemon[i];

      // check that name matches
      if (p.name == name) {

        // check that isAlolan if required
        if ((isAlolan && p.form == 'alolan') || (!isAlolan && p.form == 'original')) {

          // check that variation matches if required
          if (variation == null || p.variation == null || p.variation == variation) {
            pm.push(p);
          }
        }
      }
    }
    return pm;
  }

};

},{"../../lib/data-store":16}],7:[function(require,module,exports){
DataStore = require('../../lib/data-store');

module.exports = function ($scope, Games, Generations) {

  $scope.formData = {};
  $scope.dataStore = new DataStore();

  $scope.dataStore.getGames(Games);
  $scope.dataStore.getGenerations(Generations);

  $scope.createGame = function() {
    Games.create(createGameObj($scope.formData))
      .then((res) => {
        if (res.status == 200) {
          $scope.formData = {};
          $scope.dataStore.getGames(Games);
        }
      });
  }

  $scope.deleteGame = function(id) {
    Games.delete(id)
      .then((res) => {
        $scope.dataStore.getGames(Games);
      });
  }

  function createGameObj(formData) {
    return {
      "code": formData.code,
      "name": formData.name,
      "generationId": $scope.dataStore.getGenerationIdByName(formData.generation)
    };
  }

};

},{"../../lib/data-store":16}],8:[function(require,module,exports){
DataStore = require('../../lib/data-store');

module.exports = function ($scope, Generations) {

  $scope.formData = {};
  $scope.dataStore = new DataStore();

  $scope.dataStore.getGenerations(Generations);

  $scope.createGen = function() {
    Generations.create($scope.formData)
      .then((res) => {
        if (res.status == 200) {
          $scope.formData = {};
          $scope.dataStore.getGenerations(Generations);
        }
      });
  }

  $scope.deleteGen = function(id) {
    Generations.delete(id)
      .then((res) => {
        $scope.dataStore.getGenerations(Generations);
      });
  }

};

},{"../../lib/data-store":16}],9:[function(require,module,exports){
DataStore = require('../../lib/data-store');

module.exports = function ($scope, Items) {

  $scope.formData = {};
  $scope.dataStore = new DataStore();

  $scope.dataStore.getItems(Items);

  $scope.createItem = function() {
    Items.create($scope.formData)
      .then((res) => {
        if (res.status == 200) {
          $scope.formData = {};
          $scope.dataStore.getItems(Items);
        }
      });
  }

  $scope.createItemsBulk = function() {
    Items.bulkCreate(parseBulkData($scope.formData))
      .then((res) => {
        if (res.status == 200) {
          $scope.formData = {};
          $scope.dataStore.getItems(Items);
        }
      });
  }

  $scope.deleteItem = function(id) {
    Items.delete(id)
      .then((res) => {
        $scope.dataStore.getItems(Items);
      });
  }


  // --- helper functions ---

  function parseBulkData(inputData) {
    // parse pasted data from evolutionary items table
    // http://www.serebii.net/itemdex/list/evolutionary.shtml
    let items = [];
    inputData.bulk.split('\n\n').forEach(function(i){
      const item = i.split('\t');
      items.push({
        "name" : item[0],
        "description" : item[1]
      });
    });
    return items;
  }

};

},{"../../lib/data-store":16}],10:[function(require,module,exports){
require('../../lib/table-to-json');
DataStore = require('../../lib/data-store');

module.exports = function ($scope, Learnsets, PokemonLearnsets, Generations, Pokemon, Moves, Games) {

  $scope.entryCount = 0;
  $scope.pokemonArrayIndex = 0;
  $scope.gameCodesToCheck = ["RGB", "Y", "DP", "PtHGSS", "DPPt", "HGSS", "BW", "B2W2", "XY", "ORAS"];

  $scope.formData = {};
  $scope.dataStore = new DataStore();

  $scope.dataStore.getLearnsets(Learnsets);
  $scope.dataStore.getPokemonLearnsets(PokemonLearnsets);
  $scope.dataStore.getGenerations(Generations);
  $scope.dataStore.getPokemon(Pokemon);
  $scope.dataStore.getMoves(Moves);
  $scope.dataStore.getGames(Games);

  $scope.runYqlScript = function() {
    // get list of all pokemon names for selected gen and down
    const pokemon = allPokemonByGeneration($scope.formData.gen);
    //const pm = pokemon[24];

    // TEST
    //ajaxRequestLearnsetTable(createYqlQueryUrl(pm.name, $scope.formData.gen), pm, false);

    // TODO
    // Promise loop
    // each pokemon must wait for previous pokemon to complete

    const startIndex = $scope.pokemonArrayIndex;
    const endIndex = startIndex + 100;
    for (let i = startIndex; i < Math.min(endIndex, pokemon.length); i++) {
      const pm = pokemon[i];
      ajaxRequestLearnsetTable(
        createYqlQueryUrl(pm.name, $scope.formData.gen),
        pm,
        false
      );
    }
    $scope.pokemonArrayIndex = endIndex;
  }

  $scope.createIndividualLearnset = function() {
    Pokemon.getById($scope.formData.individualPokemonId).then((res) => {
      ajaxRequestLearnsetTable(
        createIndQueryUrl($scope.formData.individualUrl, $scope.formData.individualTableXPath),
        res.data,
        true
      );
    });

  }

  $scope.deleteLearnset = function(id) {
    Learnsets.delete(id)
      .then((res) => {
        $scope.dataStore.getLearnsets(Learnsets);
      });
  }

  function createLearnsetObj(moveByLevel, moveId, generationId) {
    return {
      "level" : moveByLevel.level,
      "onEvo" : moveByLevel.onEvo,
      "byTM" : false,
      "moveId" : moveId,
    };
  }

  function createPokemonLearnsetObj(learnsetId, pokemonId, generationId, gameId) {
    return {
      "learnsetId" : learnsetId,
      "pokemonId": pokemonId,
      "genIntroducedId" : generationId,
      "genCompletedId" : generationId,
      "gameId": gameId,
    };
  }

  //====== main parser functions =======
  function parseLearnsetJson(results) {

    let movesByLevel = [];
    results.forEach((rowObj) => {
      const move = rowObj["Move"];

      // check for game-specific moves
      if (rowObj["Level"]) {
        createMoveDataFromJson(movesByLevel, move, rowObj["Level"], null);

      } else {
        // check all game codes
        $scope.gameCodesToCheck.forEach((code) => {
          let singleGameCode = code;

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
  }

  function createMoveDataFromJson(movesArray, move, levelColumn, gameCode) {
    const level = levelColumn.split("\n")[0];
    const onEvo = (level == "Evo"); // check if "on evolution" move
    let gameId = null;

    // find game id based on given code string
    if (gameCode != null) {
      for (let i = 0; i < $scope.dataStore.games.length; i++) {
        const gm = $scope.dataStore.games[i];
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
   * @return {number}
   *   returns -1 if no pokemonLearnset found
   *   or pokemonLearnsetId of updated pokemonLearnset
   */
  function updateIfDuplicate(newPokemonLearnset) {
    // gameId makes pokemonLearnset unique
    // if (newPokemonLearnset.gameId != null) {
    //   return -1;
    // }

    // loop through all pokemonLearnsets looking for duplicates on learnset/pokemon relationship
    for (let i = 0; i < $scope.dataStore.pokemonLearnsets.length; i++) {
      const pl = $scope.dataStore.pokemonLearnsets[i];

      // skip if old & new generation ranges are equivalent
      // or gameId is not null
      if (newPokemonLearnset.genIntroducedId != pl.genIntroducedId &&
        newPokemonLearnset.genCompletedId != pl.genCompletedId &&
        pl.gameId == null) {

        // if newPokemonLearnset is equivalent to another entry in DB
        if (newPokemonLearnset.learnsetId == pl.learnsetId
          && newPokemonLearnset.pokemonId == pl.pokemonId
          && newPokemonLearnset.genIntroducedId == pl.genCompletedId + 1) {

          newPokemonLearnset.genIntroducedId = pl.genIntroducedId;
          PokemonLearnsets.update(pl.id, newPokemonLearnset); // send update data

          return pl.id;
        }
      }
    }

    return -1;
  }

  function lookForExistingLearnset(newLearnset) {
    // CHECK BOTH DB AND LOCAL BEING-CREATED ARRAY OF LEARNSETS

    // loop through all learnsets looking for duplicates on level/move/etc. association
    for (let i = 0; i < $scope.dataStore.learnsets.length; i++) {
      const ls = $scope.dataStore.learnsets[i];

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

    $scope.entryCount++;

    //try {
    const results = $(res.query.results.result)
      .tableToJSON(
        { ignoreHiddenRows: false }
      );
    // } catch(e) {
    //   console.log(pokemon);
    //   console.log(res);
    // }

    const movesByLevel = parseLearnsetJson(results); // parse JSON
    const generationId = $scope.dataStore.getGenerationIdByName($scope.formData.gen);

    let learnsetsToCreate = [];

    movesByLevel.forEach((move) => { // create objects to send
      const newMoves = moveIdsByName(move.move, generationId, move.gameId);

      newMoves.forEach((newMoveId) => {
        const newLearnset = createLearnsetObj(move, newMoveId, generationId);
        const learnsetId = lookForExistingLearnset(newLearnset);

        if (learnsetId == -1) {
          learnsetsToCreate.push(newLearnset);
        }
      });

    });

    const learnsets = checkForLearnsetDuplicates(learnsetsToCreate);
    if (learnsets.length > 0) {
      Learnsets.bulkCreate(learnsets).then((res) => {

        Learnsets.get().then((res) => {
          $scope.dataStore.learnsets = res.data;
          createPokemonLearnsets(movesByLevel, pokemon, generationId);
        });

      });

    } else {
      createPokemonLearnsets(movesByLevel, pokemon, generationId);
    }
  };

  function createPokemonLearnsets(movesByLevel, pokemon, generationId) {
    //console.log(movesByLevel);
    movesByLevel.forEach((move) => { // create objects to send
      const newMoves = moveIdsByName(move.move, generationId, move.gameId);

      newMoves.forEach((newMoveId) => {
        const newLearnset = createLearnsetObj(move, newMoveId, generationId);
        const learnsetId = lookForExistingLearnset(newLearnset);

        if (learnsetId != -1) {
          const newPokemonLearnset = createPokemonLearnsetObj(learnsetId, pokemon.id, generationId, move.gameId);
          const pokemonLearnsetId = updateIfDuplicate(newPokemonLearnset);
          if (pokemonLearnsetId == -1) {
            // create new pokemonLearnset
            PokemonLearnsets.create(newPokemonLearnset);
          }

        } else {
          console.error("learnset id not found", move);
        }

      });

    });
  }

  function checkForLearnsetDuplicates(ls) {
    for (let i = 0; i < ls.length; i++) {
      for (let j = 0; j < ls.length; j++) {
        if (i != j
          && ls[i].level == ls[j].level
          && ls[i].onEvo == ls[j].onEvo
          && ls[i].byTM == ls[j].byTM
          && ls[i].moveId == ls[j].moveId) {

          ls.splice(j, 1);
          break;
        }
      }
    }
    return ls;
  }

  /**
   * Produces an array containing pokemon that were introduced on or before the given level
   * @param  string genString    Name of Generation
   * @return Pokemon[]           Array of Pokemon introduced on or before Generation given by genString
   */
  function allPokemonByGeneration(genString) {
    let pokemon = [];
    const gen = $scope.dataStore.getGenerationIdByName(genString);
    $scope.dataStore.pokemon.forEach((p) => {
      if (p.genIntroducedId <= gen) {
        pokemon.push(p);
      }
    });
    return pokemon;
  }

  //====== query building for learnset table retrieval ==========
  function createYqlQueryUrl(pokemonName, genString) {
    // for generations excluding most recent
    const source = `https://query.yahooapis.com/v1/public/yql`;
    const query = `select * from htmlstring where url="http://bulbapedia.bulbagarden.net/wiki/${pokemonName.replace(' ', '_')}_(Pokémon)/Generation_${genString}_learnset" and xpath='//*[@id="mw-content-text"]/table[1]/tbody/tr[2]/td/table'`;
    const env = `store%3A%2F%2Fdatatables.org%2Falltableswithkeys`;

    return `${source}?q=${encodeURI(query)}&format=json&env=${env}&callback=`;
  }

  function createIndQueryUrl(individualUrl, xpath) {
    if (xpath == null) {
      xpath = `//*[@id="mw-content-text"]/table[1]/tbody/tr[2]/td/table`;
    }

    const source = `https://query.yahooapis.com/v1/public/yql`;
    const query = `select * from htmlstring where url="${individualUrl}" and xpath='${xpath}'`;
    const env = `store%3A%2F%2Fdatatables.org%2Falltableswithkeys`;

    return `${source}?q=${encodeURI(query)}&format=json&env=${env}&callback=`;
  }

  //====== remote data retrieval ========
  function ajaxRequestLearnsetTable(requestUrl, pokemon, isIndividual) {
    $.ajax({
        url: requestUrl,
        type: 'GET',
        dataType: 'json'
      })
      .done((res) => {
        prepAndSendLearnsets(res, pokemon, isIndividual);
      });
  }

  //======= find entries by name string ========

  /**
   * Find move within moves table by name
   * Check move names without differences in spacing/punctuation/capitalization
   * @param  string name  Name to find in existing moves table
   * @return array        IDs of move
   */
  function moveIdsByName(name, genId, gameId) {
    let moveIds = [];
    name = name.replace(/[^a-zA-Z0-9]*/g, '').toLowerCase();

    for (let i = 0; i < $scope.dataStore.moves.length; i++){
      const move = $scope.dataStore.moves[i];
      const n = move.name.replace(/[^a-zA-Z0-9]*/g, '').toLowerCase();
      // check generation range
      if (genId >= move.genIntroducedId && (genId <= move.genCompletedId || move.genCompletedId == null)) {
        // check gameId
        if (move.gameId == gameId || move.gameId == null) {
          if (isMoveNameEquivalent(n, name)) {
            return [$scope.dataStore.moves[i].id];
          }
        }
        else {
          if (isMoveNameEquivalent(n, name)) {
            moveIds.push($scope.dataStore.moves[i].id);
          }
        }
      }
    }

    if (moveIds.length > 0) {
      return moveIds;
    }

    console.error("no move id found", name);
    return null;
  }

};

},{"../../lib/data-store":16,"../../lib/table-to-json":17}],11:[function(require,module,exports){
DataStore = require('../../lib/data-store');

module.exports = function ($scope, Moves, Generations, Types) {

  $scope.formData = {};
  $scope.dataStore = new DataStore();

  $scope.dataStore.getMoves(Moves);
  $scope.dataStore.getGenerations(Generations);
  $scope.dataStore.getTypes(Types);

  $scope.createMove = function() {
    Moves.create(createMoveObj($scope.formData.text))
      .then((res) => {
        if (res.status == 200) {
          $scope.formData = {};
          $scope.dataStore.getMoves(Moves);
        }
      });
  }

  $scope.createMovesBulk = function() {
    Moves.bulkCreate(parseBulkData($scope.formData))
      .then((res) => {
        if (res.status == 200) {
          $scope.formData = {};
          $scope.dataStore.getMoves(Moves);
        }
      });
  }

  $scope.deleteMove = function(id) {
    Moves.delete(id)
      .then((res) => {
        $scope.dataStore.getMoves(Moves);
      });
  }


  // --- helper functions ---

  function parseBulkData(inputData) {
    // parse pasted data from bulbapedia
    // http://bulbapedia.bulbagarden.net/wiki/List_of_moves
    let moves = [];
    inputData.bulk.split('\n').forEach((m) => {

      // check if including moves with generation-based conditions
      if (inputData.includeStarred || m.indexOf('*') < 0) {
        moves.push(createMoveObj(m));
      }

    });

    return moves;
  }

  function createMoveObj(data) {
    const move = data.replace(/\*/g, '').split('\t');
    // if spaces instead of tab character
    if (move.length == 1) {
      move = move[0].split('   ');
      move.forEach((m, i) => {
        move[i] = m.trim();
      });
    }
    const gens = move[8].split('-');

    return {
      "name" : move[1],
      "typeId" : $scope.dataStore.getTypeIdByName(move[2]),
      "category" : move[3].toLowerCase(),
      "pp" : move[5],
      "power" : isNumber(move[6]) ? move[6] : null,
      "accuracy" : isNumber(move[7]) ? move[7].substr(0, move[7].indexOf('%')) : null,
      "genIntroducedId" : $scope.dataStore.getGenerationIdByName(gens[0]),
      "genCompletedId" : gens.length > 1 ? $scope.dataStore.getGenerationIdByName(gens[1]) : mostRecentGen(),
      "isTM" : "false",
      "extraInfoColumn" : move.length > 9 ? move[9] : null,
      "extraInfo" : move.length > 9 ? move[10] : null
    };
  }

  function mostRecentGen() {
    let gen = $scope.dataStore.generations[$scope.dataStore.generations.length-1].id;
    for (let i = 0; i < $scope.dataStore.generations.length; i++){
      if (gen < $scope.dataStore.generations[i].id)
        gen = $scope.dataStore.generations[i].id;
    }
    return gen;
  }

  function isNumber(data) {
    return !isNaN(parseInt(data));
  }

};

},{"../../lib/data-store":16}],12:[function(require,module,exports){
DataStore = require('../../lib/data-store');

module.exports = function ($scope, Pokemon, Generations, Types) {

  $scope.formData = {};
  $scope.dataStore = new DataStore();

  $scope.dataStore.getPokemon(Pokemon);
  $scope.dataStore.getGenerations(Generations);
  $scope.dataStore.getTypes(Types);

  $scope.createPokemonBulk = function() {
    Pokemon.bulkCreate(parseBulkData($scope.formData))
      .then((res) => {
        if (res.status == 200) {
          $scope.formData = {};
          $scope.dataStore.getPokemon(Pokemon);
        }
      });
  }

  $scope.deletePokemon = function(id) {
    Pokemon.delete(id)
      .then((res) => {
        $scope.dataStore.getPokemon(Pokemon);
      });
  }


  // --- helper functions ---

  function parseBulkData(inputData) {
    // parse pasted data from bulbapedia table
    // http://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_National_Pok%C3%A9dex_number
    let pokemon = [];
    inputData.bulk.split('\n').forEach((p) => {
      const pkmn = p.split('\t');
      pokemon.push({
        "pokedexId" : pkmn[1].substr(1),
        "name" : pkmn[3],
        "form" : (pkmn[0] == " " && inputData.gen == "1" ? "alolan" : "original"),
        "genIntroducedId" : inputData.gen,
        "primaryTypeId" : $scope.dataStore.getTypeIdByName(pkmn[4]),
        "secondaryTypeId" : (pkmn.length == 6 ? $scope.dataStore.getTypeIdByName(pkmn[5]) : null)
      });
    });
    return pokemon;
  }

};

},{"../../lib/data-store":16}],13:[function(require,module,exports){
DataStore = require('../../lib/data-store');

module.exports = function ($scope, Types) {

  $scope.formData = {};
  $scope.dataStore = new DataStore();

  $scope.dataStore.getTypes(Types);

  $scope.createType = function() {
    Types.create($scope.formData)
      .then((res) => {
        if (res.status == 200) {
          $scope.formData = {};
          $scope.dataStore.getTypes(Types);
        }
      });
  }

  $scope.deleteType = function(id) {
    Types.delete(id)
      .then((res) => {
        $scope.dataStore.getTypes(Types);
      });
  }

};

},{"../../lib/data-store":16}],14:[function(require,module,exports){
module.exports = function ($scope) {
  $scope.message = 'Page not found!';
};

},{}],15:[function(require,module,exports){
module.exports = function ($scope) {
  $scope.message = 'Everyone come and see how good I look!';
};

},{}],16:[function(require,module,exports){
module.exports = class DataStore {
  constructor() {
    this.generations = null;
    this.pokemon = null;
    this.evolutions = null;
    this.types = null;
    this.effectiveness = null;
    this.abilities = null;
    this.abilitysets = null;
    this.moves = null;
    this.learnsets = null;
    this.items = null;
    this.pokemonLearnsets = null;
    this.pokemonTypes = null;
    this.games = null;
  }

  // TODO: Send errors instead of null, then use try/catch?

  //====== Get Data Object from ID =======
  getPokemonNameById(pokemonId) {
    if (this.pokemon) {
      for (let i = 0; i < this.pokemon.length; i++){
        if (this.pokemon[i].id == [pokemonId]){
          return this.pokemon[i].name + (this.pokemon[i].form == 'alolan' ? '*' : '');
        }
      }
    }
    return null;
  }

  getAbilityNameById(abilityId) {
    if (this.abilities) {
      for (let i = 0; i < this.abilities.length; i++){
        if (this.abilities[i].id == [abilityId]){
          return this.abilities[i].name;
        }
      }
    }
    return null;
  }

  getItemNameById(itemId) {
    if (this.items) {
      for (let i = 0; i < this.items.length; i++){
        if (this.items[i].id == [itemId]){
          return this.items[i].name;
        }
      }
    }
    return null;
  }


  //====== Get ID from Name =======
  getGenerationIdByName(generationName) {
    if (this.generations) {
      for (let i = 0; i < this.generations.length; i++){
        if (this.generations[i].name == generationName){
          return this.generations[i].id;
        }
      }
    }
    return null;
  }

  getTypeIdByName(typeName) {
    if (this.types) {
      for (let i = 0; i < this.types.length; i++){
        if (this.types[i].name == typeName){
          return this.types[i].id
        }
      }
    }
    return null;
  }

  getAbilityIdByName(abilityName) {
    if (this.abilities) {
      abilityName = abilityName.replace('*', '');
      for (let i = 0; i < this.abilities.length; i++){
        if (this.abilities[i].name == abilityName){
          return this.abilities[i].id;
        }
      }
    }
    return null;
  }

  getItemIdByName(itemName) {
    if (this.items) {
      for (let i = 0; i < this.items.length; i++){
        if (this.items[i].name == itemName){
          return this.items[i].id
        }
      }
    }
    return null;
  }


  //====== Get/Refresh Data Arrays from Database =======
  getGenerations(Generations) {
    Generations.get().then((res) => {
      this.generations = res.data;
    });
  }

  getPokemon(Pokemon) {
    Pokemon.get().then((res) => {
      this.pokemon = res.data;
    });
  }

  getEvolutions(Evolutions) {
    Evolutions.get().then((res) => {
      this.evolutions = res.data;
    });
  }

  getTypes(Types) {
    Types.get().then((res) => {
      this.types = res.data;
    });
  }

  getEffectiveness(Effectiveness) {
    Effectiveness.get().then((res) => {
      this.effectiveness = res.data;
    });
  }

  getAbilities(Abilities) {
    Abilities.get().then((res) => {
      this.abilities = res.data;
    });
  }

  getAbilitysets(Abilitysets) {
    Abilitysets.get().then((res) => {
      this.abilitysets = res.data;
    });
  }

  getMoves(Moves) {
    Moves.get().then((res) => {
      this.moves = res.data;
    });
  }

  getLearnsets(Learnsets) {
    Learnsets.get().then((res) => {
      this.learnsets = res.data;
    });
  }

  getItems(Items) {
    Items.get().then((res) => {
      this.items = res.data;
    });
  }

  getPokemonLearnsets(PokemonLearnsets) {
    PokemonLearnsets.get().then((res) => {
      this.pokemonLearnsets = res.data;
    });
  }

  getPokemonTypes(PokemonTypes) {
    PokemonTypes.get().then((res) => {
      this.pokemonTypes = res.data;
    });
  }

  getGames(Games) {
    Games.get().then((res) => {
      this.games = res.data;
    });
  }
};

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
pokemonLearnsetService  = require('./services/pokemonLearnsetService');

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

},{"./services/abilityService":19,"./services/abilitysetService":20,"./services/effectivenessService":21,"./services/evolutionService":22,"./services/gameService":23,"./services/generationService":24,"./services/itemService":25,"./services/learnsetService":26,"./services/moveService":27,"./services/pokemonLearnsetService":28,"./services/pokemonService":29,"./services/typeService":30}],19:[function(require,module,exports){
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
  }
};

},{}],28:[function(require,module,exports){
module.exports = function($http) {
  return {
    get: function() {
      return $http.get('/api/pokemon-learnsets');
    },
    create: function(data) {
      return $http.post('/api/pokemon-learnsets', data);
    },
    bulkCreate: function(data) {
      return $http.post('/api/pokemon-learnsets/bulk', data);
    },
    update: function(id, data) {
      return $http.put('/api/pokemon-learnsets/' + id, data);
    },
    delete: function(id) {
      return $http.delete('/api/pokemon-learnsets/' + id);
    },
  }
};

},{}],29:[function(require,module,exports){
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
    },
  }
};

},{}],30:[function(require,module,exports){
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
    },
  }
};

},{}]},{},[1]);
