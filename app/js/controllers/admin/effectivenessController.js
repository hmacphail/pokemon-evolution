DataStore = require('../../lib/dataStore');

module.exports = function ($scope, Effectiveness, Generations, Types) {

  $scope.formData = {};
  $scope.dataStore = new DataStore();

  $scope.dataStore.getEffectiveness(Effectiveness);
  $scope.dataStore.getGenerations(Generations);
  $scope.dataStore.getTypes(Types);

  $scope.createEffectivenessBulk = function() {
    // prep data to send
    var effectiveness = checkBulkForDuplicates(parseBulkData($scope.formData));

    Effectiveness.bulkCreate(effectiveness)
      .then((res) => {
        if (res.status == 200) {
          $scope.formData = {};
          $scope.dataStore.getEffectiveness(Effectiveness);
        }
      });
  }

  $scope.deleteEffectiveness = function(id) {
    Effectiveness.delete(id)
      .then((res) => {
        $scope.dataStore.getEffectiveness(Effectiveness);
      });
  };


  // --- helper functions ---

  function parseBulkData(inputData) {
    // parse pasted data from bulbapedia table
    // http://bulbapedia.bulbagarden.net/wiki/Type/Type_chart
    var effectiveness = [];
    var effects = inputData.bulk.split('\n');

    for (var ii = 0; ii < effects.length; ii++) {
      var e = effects[ii].split('\t');
      var attType = typeIdByName(e[0]);

      for (var jj = 0; jj < effects.length; jj++) {

        var defType = typeIdByName(effects[jj].substr(0, effects[jj].indexOf('\t')));
        try {
          effectiveness.push({
            "comparison" : getComparisonEnum(e[jj+1]),
            "attackingTypeId" : attType,
            "defendingTypeId" : defType,
            "genIntroducedId" : parseInt(inputData.fromGen),
            "genCompletedId" : parseInt(inputData.toGen)
          });
        }
        catch(error) {
          console.log(error);
          return [];
        }
      }
    }
    return effectiveness;
  }

  function checkBulkForDuplicates(dataToCheck) {
    // check against existing data for matches
    var bulkDataToSend = [];
    dataToCheck.forEach(function(newEffect) {
      // add every object to send array
      bulkDataToSend.push(newEffect);

      for(var i = 0; i< $scope.dataStore.effectiveness.length; i++) {
        var oldEffect = $scope.dataStore.effectiveness[i];

        // skip if old & new generation ranges are equivalent
        if (newEffect.genIntroducedId != oldEffect.genIntroducedId
          && newEffect.genCompletedId != oldEffect.genCompletedId) {

          // if this effectiveness is equal to a previous generation (or another entry in DB)
          if (newEffect.attackingTypeId == oldEffect.attackingTypeId
            && newEffect.defendingTypeId == oldEffect.defendingTypeId
            && newEffect.comparison == oldEffect.comparison
            && newEffect.genIntroducedId == oldEffect.genCompletedId + 1) {

            bulkDataToSend.pop(); // remove from send array if just updating
            newEffect.genIntroducedId = oldEffect.genIntroducedId;
            Effectiveness.update(oldEffect.id, newEffect); // send update data
            break;
          }
        }
      }
    });
    return bulkDataToSend;
  }

  function typeIdByName(name) {
    for (var i = 0; i < $scope.dataStore.types.length; i++){
      if ($scope.dataStore.types[i].name == name){
        return $scope.dataStore.types[i].id
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
