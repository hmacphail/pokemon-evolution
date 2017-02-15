module.exports = function ($scope, Effectiveness, Types, Generations) {

  $scope.formData = {};
  getAllEffectiveness();
  getGenAndTypeData();

  $scope.createEffectivenessBulk = function() {
    Effectiveness.bulkCreate(parseBulkData($scope.formData))
      .then(function(res) {
        if (res.status == 200) {
          $scope.formData = {};
          getAllEffectiveness();
        }
      });
  }

  $scope.deleteEffectiveness = function(id) {
    Effectiveness.delete(id)
      .then(function(res) {
        getAllEffectiveness();
      });
  };


  // --- helper functions ---

  function getAllEffectiveness() {
    Effectiveness.get().then(function(res){
      $scope.effectiveness = res.data;
    });
  };

  function getGenAndTypeData() {
    Generations.get().then(function(res){
      $scope.generations = res.data;
    });
    Types.get().then(function(res){
      $scope.types = res.data;
    });
  }

  function parseBulkData(inputData) {
    // parse pasted data from bulbapedia table
    // http://bulbapedia.bulbagarden.net/wiki/Type/Type_chart
    var effectiveness = [];
    var effects = inputData.bulk.split('\n');

    for (var ii = 0; ii < effects.length; ii++) {
      var e = effects[ii].split('\t');
      var attType = typeIdByName(e[0]);

      for (var jj = 0; jj < effects.length; jj++) {

        var defType = effects[jj].substr(0, effects[jj].indexOf('\t'));
        try {
          effectiveness.push({
            "comparison" : getComparisonEnum(e[jj+1]),
            "attackingTypeId" : attType,
            "defendingTypeId" : defType,
            "genIntroducedId" : inputData.fromGen,
            "genCompletedId" : inputData.toGen
          });
        } catch(error) {
          console.log(error);
          return [];
        }
      }
    }
    return effectiveness;
  }

  function typeIdByName(name) {
    for (var i = 0; i < $scope.types.length; i++){
      if ($scope.types[i].name == name){
        return $scope.types[i].id
      }
    }
  }

  function getComparisonEnum(multiplier) {
    switch(multiplier) {
      case "2×" : return "strong";
      case "1×" : return "neutral";
      case "½×" : return "weak";
      case "0×" : return "unaffected";
      default : throw new Error();
    }
  }

};
