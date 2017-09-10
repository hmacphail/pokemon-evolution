DataStore = require('../../lib/dataStore');

module.exports = function ($scope, Games, Generations) {

  $scope.formData = {};
  $scope.dataStore = new DataStore();

  $scope.dataStore.getGames(Games);
  $scope.dataStore.getGenerations(Generations);

  $scope.createGame = function() {
    Games.create(createGameObj($scope.formData))
      .then((res) => {
        if (res.status == 200) {
          $scope.formData = {};
          $scope.dataStore.getGames(Games);
        }
      });
  };

  $scope.deleteGame = function(id) {
    Games.delete(id)
      .then((res) => {
        $scope.dataStore.getGames(Games);
      });
  };


  // --- helper functions ---

  function createGameObj(formData) {
    return {
      "code": formData.code,
      "name": formData.name,
      "generationId": generationIdByName(formData.generation)
    };
  }

  function generationIdByName(name) {
    for (var i = 0; i < $scope.dataStore.generations.length; i++){
      if ($scope.dataStore.generations[i].name == name){
        return $scope.dataStore.generations[i].id
      }
    }
    return null;
  };

};
