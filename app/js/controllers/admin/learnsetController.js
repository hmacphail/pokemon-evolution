require('../../lib/tableToJson');

module.exports = function ($scope, Learnset, Generation, Pokemon, Move) {

  $scope.entryCount = 0;
  $scope.formData = {};
  getAllLearnsets();
  getAssociatedData();

  $scope.runYqlScript = function() {
    // get list of all pokemon names for selected gen and down
    var pokemon = allPokemonByGeneration($scope.formData.gen);
    var p = pokemon[0];
    //pokemon.forEach(function(pm) {
      ajaxRequestLearnsetTable(
        createYqlQueryUrl(p.name, $scope.formData.gen),
        pm
      );
    //});

  };

  $scope.createIndividualLearnset = function() {
    Pokemon.getById($scope.formData.individualPokemonId).then(function(res) {
      ajaxRequestLearnsetTable(
        createIndQueryUrl($scope.formData.individualUrl, $scope.formData.individualTableXPath),
        res.data
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

  function createLearnsetObj(moveByLevel) {
    var gen = generationIdByName($scope.formData.gen);
    var newObj = {
      "level" : moveByLevel.level,
      "onEvo" : moveByLevel.onEvo,
      "byTM" : false,
      "moveId" : moveIdByName(moveByLevel.move, gen),
      "genIntroducedId" : gen,
      "genCompletedId" : gen,
    };
    return newObj;

  };

  //====== main parser functions =======
  function parseLearnsetJson(results) {
    var movesByLevel = [];

    results.forEach(function(rowObj) {
      //console.log(rowObj);
      var move = rowObj["Move"];
      var level = (rowObj["Level"]) ? rowObj["Level"].split("\n")[0] : rowObj["RGB"];
      var onEvo = (level == "Evo"); // check if "on evolution" move

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
  function checkForDuplicates(newLearnset, pokemonId) {
    // loop through all learnsets looking for duplicates on level/move/etc. association
    for (var i = 0; i < $scope.learnsets.length; i++) {
      var ls = $scope.learnsets[i];

      // skip if old & new generation ranges are equivalent
      if (newLearnset.genIntroducedId != ls.genIntroducedId
        && newLearnset.genCompletedId != ls.genCompletedId) {

        // if newLearnset is equal to a previous generation (or another entry in DB)
        if (newLearnset.level == ls.level
          && newLearnset.onEvo == ls.onEvo
          && newLearnset.moveId == ls.moveId
          && newLearnset.genIntroducedId == ls.genCompletedId + 1) {

          // loop through learnset's pokemon array to match given pokemonId
          for (var j = 0; j < ls.pokemon.length; j++) {
            var p = ls.pokemon[j];
            if (p.id == pokemonId) {
              newLearnset.genIntroducedId = ls.genIntroducedId;
              Learnset.update(ls.id, newLearnset); // send update data
              console.log(newLearnset);
              return true;
            }
          }

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
    var results = $(res.query.results.result)
      .tableToJSON(
        { ignoreHiddenRows: false }
      );

    var movesByLevel = parseLearnsetJson(results); // parse JSON
    movesByLevel.forEach(function(row) { // create objects to send
      var newLearnset = createLearnsetObj(row);
      if (!checkForDuplicates(newLearnset, pokemon.id)) {
        learnsets.push(newLearnset);
      }
    });
    //console.log(learnsets);
    // send data
    learnsets.forEach(function(ls) {
      Learnset.create({ learnset: ls, pokemon: [pokemon.id] });




      // since we are going thru all pokemon in db not by number or name,
      // create array with one pokemon for creating learnset, but only if form == 'original' or variation == null (??)
      // otherwise, check for existing entry. if not found, create as array like above,
      // if found, create single entry in pokemonLearnset (manually?)

      // creating array like this only good for Gen 1
      // or maybe only for things with no variation (or form..?)




    });
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
  function ajaxRequestLearnsetTable(requestUrl, pokemon) {
    $.ajax({
        url: requestUrl,
        type: 'GET',
        dataType: 'json'
      })
      .done(function(res) {
        prepAndSendLearnsets(res, pokemon);
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
      }
    }
    return null;
  };

};
