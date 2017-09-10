DataStore = require('../../lib/dataStore');

module.exports = function ($scope, Types) {

  $scope.formData = {};
  $scope.dataStore = new DataStore();

  $scope.dataStore.getTypes(Types);

  $scope.createType = function() {
    Types.create($scope.formData)
      .then((res) => {
        if (res.status == 200) {
          $scope.formData = {};
          $scope.dataStore.getTypes(Types);
        }
      });
  };

  $scope.deleteType = function(id) {
    Types.delete(id)
      .then((res) => {
        $scope.dataStore.getTypes(Types);
      });
  };

};
