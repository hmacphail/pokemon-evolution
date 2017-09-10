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

  function createGameObj(formData) {
    return {
      "code": formData.code,
      "name": formData.name,
      "generationId": $scope.dataStore.getGenerationIdByName(formData.generation)
    };
  }

};
