module.exports = function ($scope, Games, Generations) {

  $scope.formData = {};
  getAllGames();
  getAllGenerations();

  $scope.createGame = function() {
    Games.create(createGameObj($scope.formData))
      .then(function(res) {
        if (res.status == 200) {
          $scope.formData = {};
          getAllGames();
        }
      });
  };

  $scope.deleteGame = function(id) {
    Games.delete(id)
      .then(function(res) {
        getAllGames();
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

  function getAllGames() {
    Games.get().then(function(res){
      $scope.games = res.data;
    });
  };

  function getAllGenerations() {
    Generations.get().then(function(res){
      $scope.generations = res.data;
    });
  }

  function generationIdByName(name) {
    for (var i = 0; i < $scope.generations.length; i++){
      if ($scope.generations[i].name == name){
        return $scope.generations[i].id
      }
    }
    return null;
  };

};
