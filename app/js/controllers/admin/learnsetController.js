require('../../lib/tableToJson');

module.exports = function ($scope, Learnset, Generation, Pokemon, Move) {

  $scope.entryCount = 0;
  $scope.formData = {};
  getAllLearnsets();
  getAssociatedData();

  $scope.runYqlScript = function() {
    // get list of all pokemon names for selected gen and down
    var pokemon = pokemonByGeneration($scope.formData.gen);
    //var p = pokemon[0];
    pokemon.forEach(function(p) {
      // create urls to yql query
      var pokeUrl = createYqlQueryUrl(p.name, $scope.formData.gen);
      //console.log(pokeUrl);
      $.ajax({
        url: pokeUrl,
        type: 'GET',
        dataType: 'json'
      })
      .done(function(res) {
        prepAndSendLearnsets(res, p);
      });
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
          Learnset.update(ls.id, newLearnset); // send update data
          console.log(newLearnset);
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
    var results = $(res.query.results.result)
      .tableToJSON(
        { ignoreHiddenRows: false }
      );

    var movesByLevel = parseLearnsetJson(results); // parse JSON
    movesByLevel.forEach(function(row) { // create objects to send
      var newLearnset = createLearnsetObj(row, pokemon);
      if (!checkForDuplicates(newLearnset)) {
        learnsets.push(newLearnset);
      }
    });
    //console.log(learnsets);
    // send data
    learnsets.forEach(function(ls) {
      Learnset.create({ learnset: ls, pokemon: [pokemon.id] });
      // creating array like this only good for Gen 1
      // or maybe only for things with no variation (or form..?)
    });
    /*Learnset.bulkCreate({ learnsets: learnsets, pokemon: [pokemon] })
      .then(function(res){
        res.data.forEach(function(ls) {

          //console.log(ls);
          ls.setPokemon([pokemon]);
        });
      });
    console.log(learnsets);*/
  };

  /**
   * Produces an array containing pokemon that were introduced on or before the given level
   * @param  string genString    Name of Generation
   * @return Pokemon[]           Array of Pokemon introduced on or before Generation given by genString
   */
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
   * @param  string name Name to find in existing moves table
   * @return string      ID of move
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
