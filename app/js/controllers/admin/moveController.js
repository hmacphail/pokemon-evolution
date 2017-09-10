DataStore = require('../../lib/dataStore');

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
