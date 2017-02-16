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

      if (m.indexOf('*') < 0) { // moves without generation-based conditions
        moves.push(createMoveObj(m));
      }

    });
    //console.log(moves);
    return moves;
  }

  function createMoveObj(data) {
    var move = data.replace('*', '').split('\t');
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
      "isTM": "false"
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
