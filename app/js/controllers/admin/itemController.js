module.exports = function ($scope, Items) {

  $scope.formData = {};
  getAllItems();

  $scope.createItem = function() {
    Items.create($scope.formData)
      .then(function(res) {
        if (res.status == 200) {
          $scope.formData = {};
          getAllItems();
        }
      });
  };

  $scope.createItemsBulk = function() {
    Items.bulkCreate(parseBulkData($scope.formData))
      .then(function(res) {
        if (res.status == 200) {
          $scope.formData = {};
          getAllItems();
        }
      });
  }

  $scope.deleteItem = function(id) {
    Items.delete(id)
      .then(function(res) {
        getAllItems();
      });
  };

  function getAllItems() {
    Items.get().then(function(res){
      $scope.items = res.data;
    });
  };

  function parseBulkData(inputData) {
    // parse pasted data from evolutionary items table
    // http://www.serebii.net/itemdex/list/evolutionary.shtml
    var items = [];
    inputData.bulk.split('\n\n').forEach(function(i){
      var item = i.split('\t');
      items.push({
        "name" : item[0],
        "description" : item[1]
      });
    });
    return items;
  }

};
