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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
module.exports = function ($scope, Learnset, Generation, Pokemon, Move) {

  $scope.entryCount = 0;
  $scope.formData = {};
  getAllLearnsets();
  getAssociatedData();

  $scope.runYqlScript = function() {
    // get list of all pokemon names for selected gen and down
    var pokemon = pokemonByGeneration($scope.formData.gen);
    var p = pokemon[0];
    //pokemon.forEach(function(p) {
      // create urls to yql query
      var pokeUrl = createYqlQueryUrl(p.name, $scope.formData.gen);
      console.log(pokeUrl);
      $.ajax({
        url: pokeUrl,
        type: 'GET',
        dataType: 'json'
      })
      .done(function(res) {
        prepAndSendLearnsets(res, p);
      });
    //});
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

  function createLearnsetObj(moveByLevel, pokemon) {
    var gen = generationIdByName($scope.formData.gen);
    //var newObj = new Learnset();
    //console.log(newObj);
    var newObj = {
      "level" : moveByLevel.level,
      "onEvo" : moveByLevel.onEvo,
      "byTM" : false,
      "moveId" : moveIdByName(moveByLevel.move),
      "pokemonId" : pokemon.id,
      "genIntroducedId" : gen,
      "genCompletedId" : gen,
    };
    //newObj.setPokemon([pokemon]);
    return newObj;
  };

  //====== main parser functions =======
  function parseLearnsetJson(results) {
    var headerRow = results[0].tr.th;
    var moveInd = 0;
    for (var i = 0; i < headerRow.length; i++) {
      if (headerRow[i].a && headerRow[i].a.title == 'Move') {
        moveInd = i;
        break;
      }
    }

    var movesByLevel = [];
    results.splice(0,1);
    results.forEach(function(row) {
      var rowData = row.tr.td;
      var level = rowData[0].content;
      var move;
      if (rowData[moveInd].a) {
        move = rowData[moveInd].a.span.content;
      }
      else if (rowData[moveInd].b) {
        move = rowData[moveInd].b.a.span.content;
      }
      else if (rowData[moveInd].i) {
        move = rowData[moveInd].i.a.span.content;
      }

      // check if "on evolution" move
      var onEvo = (level == "Evo");

      // level is a number or onEvo (not N/A)
      if (!isNaN(parseInt(level)) || onEvo) {
        movesByLevel.push({
          "move" : move,
          "level" : onEvo ? null : parseInt(level),
          "onEvo" : onEvo
        });
      }

    });

    return movesByLevel;
  };

  /**
   * checks existing data for duplicates
   * update duplicates with new genCompletedId
   * @return {bool} returns true if duplicate was found
   */
  function checkForDuplicates(newLearnset) {
    $scope.learnsets;
    for (var i = 0; i < $scope.learnsets.length; i++) {
      var ls = $scope.learnsets[i];

      // skip if old & new generation ranges are equivalent
      if (newLearnset.genIntroducedId != ls.genIntroducedId
        && newLearnset.genCompletedId != ls.genCompletedId) {

        // if newLearnset is equal to a previous generation (or another entry in DB)
        if (newLearnset.level == ls.level
          && newLearnset.onEvo == ls.onEvo
          && newLearnset.moveId == ls.moveId
          && newLearnset.pokemonId == ls.pokemonId
          && newLearnset.genIntroducedId == ls.genCompletedId + 1) {

          newLearnset.genIntroducedId = ls.genIntroducedId;
          //Learnset.update(ls.id, newLearnset); // send update data
          //console.log(newLearnset);
          return true;
        }
      }
    }


    return false;
  }

  //====== data preparation =======
  function prepAndSendLearnsets(res, pokemon) {
    var learnsets = [];
    $scope.entryCount++;

    console.log(pokemon.name);
    console.log(res.query.results);

    var results = res.query.results.tbody;
    var movesByLevel = parseLearnsetJson(results); // parse JSON
    movesByLevel.forEach(function(row) { // create objects to send
      var newLearnset = createLearnsetObj(row, pokemon);
      if (!checkForDuplicates(newLearnset)) {
        learnsets.push(newLearnset);
      }
    });
    //console.log(learnsets);
    // send data
    Learnset.bulkCreate({ learnsets: learnsets, pokemon: [pokemon] })
      .then(function(res){
        res.data.forEach(function(ls) {

          //console.log(ls);
          //ls.setPokemon([pokemon]);
        });
      });
  };

  function pokemonByGeneration(genString) {
    var pokemon = [];
    var gen = generationIdByName(genString);
    $scope.pokemon.forEach(function(p){
      if (p.genIntroducedId <= gen) {
        pokemon.push(p);
      }
    });
    return pokemon;
  };

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

  //====== remote data retrieval ========
  function getAllLearnsets() {
    Learnset.get().then(function(res){
      $scope.learnsets = res.data;
    });
  };

  function getAssociatedData() {
    Generation.get().then(function(res){
      $scope.generations = res.data;
    });
    Pokemon.get().then(function(res){
      $scope.pokemon = res.data;
    });
    Move.get().then(function(res){
      $scope.moves = res.data;
    });
  };

  //======= find entries by name string ========
  function generationIdByName(name) {
    for (var i = 0; i < $scope.generations.length; i++){
      if ($scope.generations[i].name == name){
        return $scope.generations[i].id
      }
    }
  };

  function pokemonIdByName(name) {
    for (var i = 0; i < $scope.pokemon.length; i++){
      if ($scope.pokemon[i].name == name){
        return $scope.pokemon[i].id
      }
    }
  };

  /**
   * Find move within moves table by name
   * Check move names without differences in spacing/punctuation/capitalization
   * @param  {string} name Name to find in existing moves table
   * @return {string}      ID of move
   */
  function moveIdByName(name) {
    name = name.replace(/[^a-zA-Z0-9]*/g, '').toLowerCase();
    for (var i = 0; i < $scope.moves.length; i++){
      var n = $scope.moves[i].name.replace(/[^a-zA-Z0-9]*/g, '').toLowerCase();
      if (n == name){
        return $scope.moves[i].id;
      }
      // special conditions
      else if (n == 'highjumpkick' && name == 'hijumpkick') {
        return $scope.moves[i].id;
      }
    }
  };

};

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
var homeController          = require('./homeController');
var errorController         = require('./errorController');
var generationController    = require('./admin/generationController');
var pokemonController       = require('./admin/pokemonController');
var evolutionController     = require('./admin/evolutionController');
var typeController          = require('./admin/typeController');
var effectivenessController = require('./admin/effectivenessController');
var abilityController       = require('./admin/abilityController');
var abilitysetController    = require('./admin/abilitysetController');
var moveController          = require('./admin/moveController');
var learnsetController      = require('./admin/learnsetController');
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
ctrl.controller('abilitysetController', ['$scope', 'Abilitysets', 'Generations', 'Pokemon', 'Abilities', abilitysetController]);
ctrl.controller('moveController', ['$scope', 'Moves', 'Generations', 'Types', moveController]);
ctrl.controller('learnsetController', ['$scope', 'Learnsets', 'Generations', 'Pokemon', 'Moves', learnsetController]);
ctrl.controller('itemController', ['$scope', 'Items', itemController]);

},{"./admin/abilityController":1,"./admin/abilitysetController":2,"./admin/effectivenessController":3,"./admin/evolutionController":4,"./admin/generationController":5,"./admin/itemController":6,"./admin/learnsetController":7,"./admin/moveController":8,"./admin/pokemonController":9,"./admin/typeController":10,"./errorController":12,"./homeController":13}],12:[function(require,module,exports){
module.exports = function ($scope) {
    $scope.message = 'Page not found!';
  };


},{}],13:[function(require,module,exports){
module.exports = function ($scope) {
    $scope.message = 'Everyone come and see how good I look!';
  };


},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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

},{}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
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

},{"./admin/abilityService":14,"./admin/abilitysetService":15,"./admin/effectivenessService":16,"./admin/evolutionService":17,"./admin/generationService":18,"./admin/itemService":19,"./admin/learnsetService":20,"./admin/moveService":21,"./admin/pokemonService":22,"./admin/typeService":23}],25:[function(require,module,exports){
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
    .otherwise({redirectTo: '/404'});
  $locationProvider.html5Mode(true);
}]);

},{"./controllers/controllers":11,"./services/services":24}]},{},[25]);
