module.exports = function ($scope, Learnsets, Generations, Pokemon, Moves) {

  $scope.formData = {};
  getAllLearnsets();
  getAssociatedData();

  $scope.createLearnsetsBulk = function() {
    Learnsets.bulkCreate(parseBulkData($scope.formData))
      .then(function(res) {
        if (res.status == 200) {
          $scope.formData = {};
          getAllLearnsets();
        }
      });
  }

  $scope.deleteLearnset = function(id) {
    Learnsets.delete(id)
      .then(function(res) {
        getAllLearnsets();
      });
  };


  // --- helper functions ---

  function getAllLearnsets() {
    Learnsets.get().then(function(res){
      $scope.learnsets = res.data;
    });
  };

  function getAssociatedData() {
    Generations.get().then(function(res){
      $scope.generations = res.data;
    });
    Pokemon.get().then(function(res){
      $scope.pokemon = res.data;
    });
    Moves.get().then(function(res){
      $scope.moves = res.data;
    });
  }

  function parseBulkData(inputData) {
    // parse pasted data from bulbapedia table
    // http://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_National_Pok%C3%A9dex_number
    /*var pokemon = [];
    inputData.bulk.split('\n').forEach(function(p){
      var pkmn = p.split('\t');
      pokemon.push({
        "pokedexId" : pkmn[1].substr(1),
        "name" : pkmn[3],
        "form" : (pkmn[0] == " " && inputData.gen == "1" ? "alolan" : "original"),
        "genIntroducedId" : inputData.gen,
        "primaryTypeId" : typeIdByName(pkmn[4]),
        "secondaryTypeId" : (pkmn.length == 6 ? typeIdByName(pkmn[5]) : null)
      });
    });
    return pokemon;*/
  }

  function pokemonIdByName(name) {
    for (var i = 0; i < $scope.pokemon.length; i++){
      if ($scope.pokemon[i].name == name){
        return $scope.pokemon[i].id
      }
    }
  }

  function moveIdByName(name) {
    for (var i = 0; i < $scope.moves.length; i++){
      if ($scope.moves[i].name == name){
        return $scope.moves[i].id
      }
    }
  }

};
