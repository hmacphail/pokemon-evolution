DataStore = require('../../lib/data-store');

module.exports = function ($scope, Pokemon, Generations, Types) {

  $scope.formData = {};
  $scope.dataStore = new DataStore();

  $scope.dataStore.getPokemon(Pokemon);
  $scope.dataStore.getGenerations(Generations);
  $scope.dataStore.getTypes(Types);

  $scope.createPokemonBulk = function() {
    Pokemon.bulkCreate(parseBulkData($scope.formData))
      .then((res) => {
        if (res.status == 200) {
          $scope.formData = {};
          $scope.dataStore.getPokemon(Pokemon);
        }
      });
  }

  $scope.deletePokemon = function(id) {
    Pokemon.delete(id)
      .then((res) => {
        $scope.dataStore.getPokemon(Pokemon);
      });
  }


  // --- helper functions ---

  function parseBulkData(inputData) {
    // parse pasted data from bulbapedia table
    // http://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_National_Pok%C3%A9dex_number
    let pokemon = [];
    inputData.bulk.split('\n').forEach((p) => {
      const pkmn = p.split('\t');
      pokemon.push({
        "pokedexId" : pkmn[1].substr(1),
        "name" : pkmn[3],
        "form" : (pkmn[0] == " " && inputData.gen == "1" ? "alolan" : "original"),
        "genIntroducedId" : inputData.gen,
        "primaryTypeId" : $scope.dataStore.getTypeIdByName(pkmn[4]),
        "secondaryTypeId" : (pkmn.length == 6 ? $scope.dataStore.getTypeIdByName(pkmn[5]) : null)
      });
    });
    return pokemon;
  }

};
