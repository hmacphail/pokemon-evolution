module.exports = function ($scope, Abilitysets, Generations, Pokemon, Abilities) {

  $scope.formData = {};
  getAllAbilitysets();
  getAssociatedData();

  $scope.createAbilitysetsBulk = function() {
    //parseBulkData($scope.formData);
    Abilitysets.bulkCreate(parseBulkData($scope.formData))
      .then(function(res) {
        if (res.status == 200) {
          $scope.formData = {};
          getAllAbilitysets();
        }
      });
  }

  $scope.deleteAbilityset = function(id) {
    Abilitysets.delete(id)
      .then(function(res) {
        getAllAbilitysets();
      });
  };

  $scope.pokemonName = function(pokemonId) {
    if ($scope.pokemon) {
      for (var i = 0; i < $scope.pokemon.length; i++){
        if ($scope.pokemon[i].id == [pokemonId]){
          return $scope.pokemon[i].name + ($scope.pokemon[i].form == 'alolan' ? '*' : '');
        }
      }
    }
  };

  $scope.abilityName = function(abilityId) {
    if ($scope.abilities) {
      for (var i = 0; i < $scope.abilities.length; i++){
        if ($scope.abilities[i].id == [abilityId]){
          return $scope.abilities[i].name;
        }
      }
    }
  }


  // --- helper functions ---

  function getAllAbilitysets() {
    Abilitysets.get().then(function(res){
      $scope.abilitysets = res.data;
    });
  };

  function getAssociatedData() {
    Generations.get().then(function(res){
      $scope.generations = res.data;
    });
    Pokemon.get().then(function(res){
      $scope.pokemon = res.data;
    });
    Abilities.get().then(function(res){
      $scope.abilities = res.data;
    });
  }

  function parseBulkData(inputData) {
    // parse pasted data from bulbapedia table
    // http://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_Ability
    //console.log(inputData.bulk);
    var abilitysets = [];
    inputData.bulk.split('\n').forEach(function(a){
      var as = a.split('\t');

      // if this pokemon is not a Mega Evolution
      if (as[2].indexOf('Mega') < 0 && as[2].indexOf('*') < 0) {

        var pokeId = pokemonIdByName(as[2]);
        var genId = generationByPokemonId(pokeId);

        // check if including moves with generation-based conditions
        /*if (inputData.includeStarred || m.indexOf('*') < 0) {
          moves.push(createMoveObj(m));
        }*/

        if (as[3] && as[3].indexOf('*') < 0) { // primary ability
          abilitysets.push(createAbilitysetObj(pokeId, genId, abilityIdByName(as[3]), "primary"));
        }
        if (as[4] && as[4].indexOf('*') < 0) { // secondary ability
          abilitysets.push(createAbilitysetObj(pokeId, genId, abilityIdByName(as[4]), "secondary"));
        }
        if (as[5] && as[5].indexOf('*') < 0) { // hidden ability
          abilitysets.push(createAbilitysetObj(pokeId, genId, abilityIdByName(as[5]), "hidden"));
        }
      }

      //gen is generation of pokemon (excluding I and II) unless conditional * is present
    });

    console.log(abilitysets);
    return abilitysets;
  }

  function createAbilitysetObj(pokemonId, generationId, abilityId, trait) {
    return {
        "pokemonId" : pokemonId,
        "abilityId" : abilityId,
        "genIntroducedId" : generationId < 3 ? 3 : generationId, // gen is generation of pokemon (excluding I and II)
        "trait" : trait
      };
  }

  function pokemonIdByName(name) {
    var isAlolan = (name.indexOf('Alolan') >= 0);
    if (isAlolan) {
      name = name.split(' ')[1];
    }
    for (var i = 0; i < $scope.pokemon.length; i++){
      if ($scope.pokemon[i].name == name){
        if ((!isAlolan && $scope.pokemon[i].form == 'original') ||
          (isAlolan && $scope.pokemon[i].form == 'alolan')) {
          return $scope.pokemon[i].id;
        }
      }
    }
  }

  function generationByPokemonId(pokemonId) {
    for (var i = 0; i < $scope.pokemon.length; i++){
      if ($scope.pokemon[i].id == pokemonId){
        return $scope.pokemon[i].genIntroducedId;
      }
    }
  }

  function abilityIdByName(name) {
    for (var i = 0; i < $scope.abilities.length; i++){
      if ($scope.abilities[i].name == name){
        return $scope.abilities[i].id;
      }
    }
  }

};
