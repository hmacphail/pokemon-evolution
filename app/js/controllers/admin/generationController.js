DataStore = require('../../lib/dataStore');

module.exports = function ($scope, Generations) {

  $scope.formData = {};
  $scope.dataStore = new DataStore();

  $scope.dataStore.getGenerations(Generations);

  $scope.createGen = function() {
    Generations.create($scope.formData)
      .then((res) => {
        if (res.status == 200) {
          $scope.formData = {};
          $scope.dataStore.getGenerations(Generations);
        }
      });
  }

  $scope.deleteGen = function(id) {
    Generations.delete(id)
      .then((res) => {
        $scope.dataStore.getGenerations(Generations);
      });
  }

};
