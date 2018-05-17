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

function isMoveNameEquivalent(originalName, newName) {
  if (originalName == newName){
    return true;
  }
  // special conditions
  else if (originalName == 'highjumpkick' && newName == 'hijumpkick') {
    return true;
  }
  else if (originalName == 'feintattack' && newName == 'faintattack') {
    return true;
  }
  else if (originalName == 'smellingsalts' && newName == 'smellingsalt') {
    return true;
  }
  return false;
}
