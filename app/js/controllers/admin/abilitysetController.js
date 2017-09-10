DataStore = require('../../lib/dataStore');

module.exports = function ($scope, Abilitysets, Generations, Pokemon, Abilities) {

  $scope.formData = {};
  $scope.dataStore = new DataStore();

  $scope.dataStore.getAbilitysets(Abilitysets);
  $scope.dataStore.getGenerations(Generations);
  $scope.dataStore.getPokemon(Pokemon);
  $scope.dataStore.getAbilities(Abilities);

  $scope.createAbilitysetsBulk = function() {
    Abilitysets.bulkCreate(parseBulkData($scope.formData))
      .then((res) => {
        if (res.status == 200) {
          $scope.formData = {};
          $scope.dataStore.getAbilitysets(Abilitysets);
        }
      });
  }

  $scope.deleteAbilityset = function(id) {
    Abilitysets.delete(id)
      .then((res) => {
        $scope.dataStore.getAbilitysets(Abilitysets);
      });
  }

  $scope.pokemonName = function(pokemonId) {
    $scope.dataStore.getPokemonNameById(pokemonId);
  }

  $scope.abilityName = function(abilityId) {
    $scope.dataStore.getAbilityNameById(abilityId);
  }


  // --- helper functions ---

  function parseBulkData(inputData) {
    // parse pasted data from bulbapedia table
    // http://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_Ability
    let abilitysets = [];
    //let prevName = "";
    inputData.bulk.split('\n').forEach((a) => {
      let as = a.split('\t');
      // if spaces instead of tab character
      if (as.length == 1) {
        as = as[0].split('   ');
        as.forEach((a, i) => {
          as[i] = a.trim();
        });
      }

      // find duplicate rows of the same pokemon
      //if (as[2].replace('*', '').includes(prevName.replace('*', ''))) {
      //  console.log(as[2]);
      //}
      //else {
      const pokeIds = pokemonIdsByName(as[2], as[1]);

      // use pokemon's gen if no gen provided
      // only need to check first pokemonId as should all be same gen
      const genIntro = as[6] || getGenerationByPokemonId(pokeIds[0]);
      const genCompl = as[7] || null;

      if (as[3] && (!inputData.includeStarred && as[3].indexOf('*') < 0 ||
        inputData.includeStarred && as[3].indexOf('*') >= 0)) {
        // primary ability
        createAbilitysetObjs(pokeIds, $scope.dataStore.getAbilityIdByName(as[3]), "primary", genIntro, genCompl).forEach((as) => {
          abilitysets.push(as);
        });
      }
      if (as[4] && (!inputData.includeStarred && as[4].indexOf('*') < 0 ||
        inputData.includeStarred && as[4].indexOf('*') >= 0)) {
        // secondary ability
        createAbilitysetObjs(pokeIds, $scope.dataStore.getAbilityIdByName(as[4]), "secondary", genIntro, genCompl).forEach((as) => {
          abilitysets.push(as);
        });
      }
      if (as[5] && (!inputData.includeStarred && as[5].indexOf('*') < 0 ||
        inputData.includeStarred && as[5].indexOf('*') >= 0)) {
        // hidden ability
        createAbilitysetObjs(pokeIds, $scope.dataStore.getAbilityIdByName(as[5]), "hidden", genIntro, genCompl).forEach((as) => {
          abilitysets.push(as);
        });
      }
      //}
      //prevName = as[2];

    });

    return abilitysets;
  }

  function createAbilitysetObjs(pokemonIds, abilityId, trait, genIntroducedId, genCompletedId) {
    // gen introduced is generation of pokemon
    // exception: abilities introduced in Gen III, hidden abilities introduced in Gen V
    if (trait == "hidden" && genIntroducedId < 5) {
      genIntroducedId = 5;
    }
    if (genIntroducedId < 3) {
      genIntroducedId = 3;
    }

    let as = [];
    for (let i = 0; i < pokemonIds.length; i++) {
      as.push({
        "pokemonId" : pokemonIds[i],
        "abilityId" : abilityId,
        "genIntroducedId" : genIntroducedId,
        "genCompletedId" : genCompletedId,
        "trait" : trait
      });
    }
    return as;
  }

  //======= find data entries ========
  function pokemonIdsByName(name, variation) {
    name = name.replace('*', '');
    let pm = [];
    const isAlolan = (name.indexOf('Alolan') >= 0);
    if (isAlolan) {
      name = name.split(' ')[1];
    }
    for (let i = 0; i < $scope.dataStore.pokemon.length; i++){
      const p = $scope.dataStore.pokemon[i];

      // check that name matches
      if (p.name == name){

        // check that isAlolan if required
        if ((!isAlolan && p.form != 'alolan') || (isAlolan && p.form == 'alolan')) {

          // check that variation matches if required (unless mega)
          if (variation == name || p.form == 'mega' || p.variation == variation) {
            pm.push(p.id);
          }
        }
      }
    }

    return pm;
  }

  function getGenerationByPokemonId(pokemonId) {
    for (let i = 0; i < $scope.dataStore.pokemon.length; i++){
      if ($scope.dataStore.pokemon[i].id == pokemonId){
        return $scope.dataStore.pokemon[i].genIntroducedId;
      }
    }
  }

};
