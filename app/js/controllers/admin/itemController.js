DataStore = require('../../lib/data-store');

module.exports = function ($scope, Items) {

  $scope.formData = {};
  $scope.dataStore = new DataStore();

  $scope.dataStore.getItems(Items);

  $scope.createItem = function() {
    Items.create($scope.formData)
      .then((res) => {
        if (res.status == 200) {
          $scope.formData = {};
          $scope.dataStore.getItems(Items);
        }
      });
  }

  $scope.createItemsBulk = function() {
    Items.bulkCreate(parseBulkData($scope.formData))
      .then((res) => {
        if (res.status == 200) {
          $scope.formData = {};
          $scope.dataStore.getItems(Items);
        }
      });
  }

  $scope.deleteItem = function(id) {
    Items.delete(id)
      .then((res) => {
        $scope.dataStore.getItems(Items);
      });
  }


  // --- helper functions ---

  function parseBulkData(inputData) {
    // parse pasted data from evolutionary items table
    // http://www.serebii.net/itemdex/list/evolutionary.shtml
    let items = [];
    inputData.bulk.split('\n\n').forEach(function(i){
      const item = i.split('\t');
      items.push({
        "name" : item[0],
        "description" : item[1]
      });
    });
    return items;
  }

};
