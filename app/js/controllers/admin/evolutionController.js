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
