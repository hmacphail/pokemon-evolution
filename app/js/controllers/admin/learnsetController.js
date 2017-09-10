require('../../lib/tableToJson');
DataStore = require('../../lib/dataStore');

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
    const pm = pokemon[24];

    // TEST
    ajaxRequestLearnsetTable(createYqlQueryUrl(pm.name, $scope.formData.gen), pm, false);

    /*
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
    */
    /*
    pokemon.forEach((pm) => {
      ajaxRequestLearnsetTable(
        createYqlQueryUrl(pm.name, $scope.formData.gen),
        pm,
        false
      );
    });
    */
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

  function createLearnsetObj(moveByLevel, generationId) {
    return {
      "level" : moveByLevel.level,
      "onEvo" : moveByLevel.onEvo,
      "byTM" : false,
      "moveId" : moveIdByName(moveByLevel.move, generationId),
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
   * @return {bool} returns true if duplicate was found
   */
  function updateIfDuplicate(newPokemonLearnset) {
    // gameId makes pokemonLearnset unique
    if (newPokemonLearnset.gameId != null) {
      return -1;
    }

    // loop through all pokemonLearnsets looking for duplicates on learnset/pokemon relationship
    for (let i = 0; i < $scope.dataStore.pokemonLearnsets.length; i++) {
      const pl = $scope.dataStore.pokemonLearnsets[i];

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

    //var learnsets = [], pokemonLearnsets = [];
    $scope.entryCount++;

    console.log(pokemon.name);
    const results = $(res.query.results.result)
      .tableToJSON(
        { ignoreHiddenRows: false }
      );

    const movesByLevel = parseLearnsetJson(results); // parse JSON
    const generationId = $scope.dataStore.getGenerationIdByName($scope.formData.gen);

    //console.log(movesByLevel);

    movesByLevel.forEach((move) => { // create objects to send
      const newLearnset = createLearnsetObj(move, generationId);
      const learnsetId = lookForExistingLearnset(newLearnset);

      if (learnsetId == -1) {
        // create new learnset and pokemonLearnset
        // NEED TO WAIT FOR THIS TO FINISH BEFORE LOOP CONTINUES...
        // OR SOMEHOW GUARANTEE IT GETS ADDED
        Learnset.create(newLearnset).then((res) => {
          console.log(res.data);
          PokemonLearnsets.create(createPokemonLearnsetObj(res.data.id, pokemon.id, generationId, move.gameId));
        });
        //pokemonLearnsets.push(createPokemonLearnsetObj());
      } else {
        const newPokemonLearnset = createPokemonLearnsetObj(learnsetId, pokemon.id, generationId, move.gameId);
        const pokemonLearnsetId = updateIfDuplicate(newPokemonLearnset);
        if (pokemonLearnsetId == -1) {
          // create new pokemonLearnset
          PokemonLearnsets.create(newPokemonLearnset);
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
    const query = `select * from htmlstring where url="http://bulbapedia.bulbagarden.net/wiki/${pokemonName.replace('_', '_')}_(Pokémon)/Generation_${genString}_learnset" and xpath='//*[@id="mw-content-text"]/table[1]/tbody/tr[2]/td/table'`;
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
   * @param  string name Name to find in existing moves table
   * @return string      ID of move
   */
  function moveIdByName(name, genId) {
    name = name.replace(/[^a-zA-Z0-9]*/g, '').toLowerCase();
    for (let i = 0; i < $scope.dataStore.moves.length; i++){
      const move = $scope.dataStore.moves[i];
      const n = move.name.replace(/[^a-zA-Z0-9]*/g, '').toLowerCase();
      // check generation range
      if (genId >= move.genIntroducedId && (genId <= move.genCompletedId || move.genCompletedId == null)) {
        if (n == name){
          return $scope.dataStore.moves[i].id;
        }
        // special conditions
        else if (n == 'highjumpkick' && name == 'hijumpkick') {
          return $scope.dataStore.moves[i].id;
        }
        else if (n == 'feintattack' && name == 'faintattack') {
          return $scope.dataStore.moves[i].id;
        }
        else if (n = 'smellingsalts' && name == 'smellingsalt') {
          return $scope.dataStore.moves[i].id;
        }
      }
    }
    console.error("no move id found", name);
    return null;
  }

};
