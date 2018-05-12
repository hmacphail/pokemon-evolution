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
