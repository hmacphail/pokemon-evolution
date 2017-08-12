DataStore = require('../../lib/dataStore');

module.exports = function ($scope, Generations) {

  $scope.formData = {};
  getAllGenerations();
  //DataStore.getAllGenerations($scope.generations, Generations);

  $scope.createGen = function() {
    Generations.create($scope.formData)
      .then(function(res) {
        if (res.status == 200) {
          $scope.formData = {};
          getAllGenerations();
        }
      });
  };

  $scope.deleteGen = function(id) {
    Generations.delete(id)
      .then(function(res) {
        getAllGenerations();
      });
  };


  // --- helper functions ---
  function getAllGenerations() {
    DataStore.getAllGenerations(Generations).then(function(res) {
      $scope.generations = res;
    });
  };

};
