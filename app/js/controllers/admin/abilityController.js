DataStore = require('../../lib/dataStore');

module.exports = function ($scope, Abilities, Generations) {

  $scope.formData = {};
  $scope.dataStore = new DataStore();

  $scope.dataStore.getAbilities(Abilities);
  $scope.dataStore.getGenerations(Generations);

  $scope.createAbilitiesBulk = function() {
    Abilities.bulkCreate(parseBulkData($scope.formData))
      .then((res) => {
        if (res.status == 200) {
          $scope.formData = {};
          $scope.dataStore.getAbilities(Abilities);
        }
      });
  }

  $scope.deleteAbility = function(id) {
    Abilities.delete(id)
      .then((res) => {
        $scope.dataStore.getAbilities(Abilities);
      });
  };


  // --- helper functions ---

  function parseBulkData(inputData) {
    // parse pasted data from bulbapedia table
    // http://bulbapedia.bulbagarden.net/wiki/Ability#List_of_Abilities
    var abilities = [];
    inputData.bulk.split('\n').forEach(function(a){
      var ability = a.split('\t');
      abilities.push({
        "name" : ability[1],
        "description" : ability[2],
        "genIntroducedId" : genIdByName(ability[3])
      });
    });
    return abilities;
  }

  function genIdByName(name) {
    for (var i = 0; i < $scope.dataStore.generations.length; i++){
      if ($scope.dataStore.generations[i].name == name){
        return $scope.dataStore.generations[i].id
      }
    }
  }

};
