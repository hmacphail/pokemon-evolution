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
          var evolution = parseDataRow(inputData.trigger, prev, evo);
          if (evolution) {
            evolutions.push(evolution);
          }
          prev = [];
        }
      }
      else { // regular data row
        var evolution = parseDataRow(inputData.trigger, evo);
        if (evolution) {
          evolutions.push(evolution);
        }
      }
    });
    if (prev.length != 0) { // missed last entry
      evolutions.push(parseDataRow(inputData.trigger, prev));
    }
    return evolutions;
  };

  function parseDataRow(trigger, row1, row2) {
    if (row2) { // dual row data entry
      var frmPoke = checkAlolan(row1[0])
          ? pokemonIdByName(splitPokemonNameString(row1[0].split(' ')[1]), true)
          : pokemonIdByName(splitPokemonNameString(row1[0]), false);
        var toPoke = checkAlolan(row1[2])
          ? pokemonIdByName(splitPokemonNameString(row1[2].split(' ')[1]), true)
          : pokemonIdByName(splitPokemonNameString(row1[2].split(' ')[0]), false);

      switch (trigger) {
        case 'level' :
          var specialForm = checkSpecialCondition(row1[2]) ? row2[0] : null;
          return createEvolutionObj(frmPoke, toPoke, row2[2], row2[1], null, specialForm);
        case 'item' :
          var specialForm = checkSpecialCondition(row1[2]) ? row2[0] : null;
          var itemCond = splitItemConditionString(row2[1]);
          return createEvolutionObj(frmPoke, toPoke, itemCond[1], null, itemIdByName(itemCond[0]), specialForm);
        case 'trade' :
          return createEvolutionObj(frmPoke, toPoke, row2[1], null, null, null);
        case 'happiness' :
          return createEvolutionObj(frmPoke, toPoke, row2[1], null, null, null);
        case 'other' :
          if (row2[1] || row2[2].indexOf('Trade') >= 0) { // duplicate from other triggers
            return null;
          }
          return createEvolutionObj(frmPoke, toPoke, row2[2], null, null, null);
      }

    } else { // regular data row
      var frmPoke = pokemonIdByName(splitPokemonNameString(row1[0]));
      var toPoke = pokemonIdByName(splitPokemonNameString(row1[2]));

      switch (trigger) {
        case 'level' :
          return createEvolutionObj(frmPoke, toPoke, row1[4], row1[3], null, null);
        case 'item' :
          var itemCond = splitItemConditionString(row1[3]);
          return createEvolutionObj(frmPoke, toPoke, itemCond[1], null, itemIdByName(itemCond[0]), null);
        case 'trade' :
          var item = itemIdByName(row1[3]);
          var cond = item ? null : row1[3];
          return createEvolutionObj(frmPoke, toPoke, cond, null, item, null);
        case 'happiness' :
          return createEvolutionObj(frmPoke, toPoke, row1[3], null, null, null);
        case 'other' :
          if (row1[3] || row1[4].indexOf('Trade') >= 0) { // duplicate from other triggers
            return null;
          }
          return createEvolutionObj(frmPoke, toPoke, row1[4], null, null, null);
      }

    }
  }


  //======= data preparation ==========
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
  function pokemonIdByName(name, isAlolan) {
    for (var i = 0; i < $scope.pokemon.length; i++){
      if ($scope.pokemon[i].name == name){
        if ((isAlolan && $scope.pokemon[i].form == 'alolan')
          || (!isAlolan && $scope.pokemon[i].form == 'original'))
        return $scope.pokemon[i].id
      }
    }
    return null;
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
