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
  }

  function parseBulkData(inputData) {
    // parse pasted data from bulbapedia table
    // http://bulbapedia.bulbagarden.net/wiki/Ability#List_of_Abilities
    let abilities = [];
    inputData.bulk.split('\n').forEach((a) => {
      const ability = a.split('\t');
      abilities.push({
        "name" : ability[1],
        "description" : ability[2],
        "genIntroducedId" : $scope.dataStore.getGenerationIdByName(ability[3])
      });
    });
    return abilities;
  }

};
