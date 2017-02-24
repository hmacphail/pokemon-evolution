module.exports = function ($scope, Learnset, Generation, Pokemon, Move) {

  $scope.entryCount = 0;
  $scope.formData = {};
  getAllLearnsets();
  getAssociatedData();

  $scope.runYqlScript = function() {
    // get list of all pokemon names for selected gen and down
    var pokemon = pokemonByGeneration($scope.formData.gen);
    pokemon.forEach(function(p) {
      // create urls to yql query
      var pokeUrl = createYqlQueryUrl(p.name, $scope.formData.gen);
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
    Learnsets.delete(id)
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
    return {
      "level" : moveByLevel.level,
      "byTM" : false,
      "moveId" : moveIdByName(moveByLevel.move),
      "pokemonId" : pokemon.id,
      "genIntroducedId" : gen,
      "genCompletedId" : gen,
    };
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
      if (isNaN(parseInt(level))) {
        // check if "on evolution" move
        console.log(level.trim());
      }
      else {
        movesByLevel.push({
          "move" : move,
          "level" : parseInt(level)
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
  function checkForDuplicates(learnset) {
    $scope.learnsets;
    for (var i = 0; i < $scope.learnsets.length; i++) {
      var oldLearnset = $scope.learnsets[i];

      // skip if old & new generation ranges are equivalent
      if (learnset.genIntroducedId != oldLearnset.genIntroducedId
        && learnset.genCompletedId != oldLearnset.genCompletedId) {

        // if this learnset is equal to a previous generation (or another entry in DB)
        if (learnset.level == oldLearnset.level
          && learnset.moveId == oldLearnset.moveId
          && learnset.pokemonId == oldLearnset.pokemonId
          && learnset.genIntroducedId == oldLearnset.genCompletedId + 1) {

          learnset.genIntroducedId = oldLearnset.genIntroducedId;
          //Learnset.update(oldLearnset.id, learnset); // send update data
          //console.log(learnset);
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
    //Learnset.bulkCreate(learnsets);
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
    var query = 'select tr from html where url="http://bulbapedia.bulbagarden.net/wiki/'
      + pokemonName.replace(' ', '_')
      + '_(Pokémon)/Generation_'
      + genString
      + '_learnset" and xpath=\'//*[@id="mw-content-text"]/table[1]/tbody/tr[2]/td/table/tbody\'';

    return encodeURI(source + 'yql?q=' + query + '&format=json');
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
