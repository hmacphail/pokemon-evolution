DataStore = require('../../lib/data-store');

module.exports = function ($scope, Effectiveness, Generations, Types) {

  $scope.formData = {};
  $scope.dataStore = new DataStore();

  $scope.dataStore.getEffectiveness(Effectiveness);
  $scope.dataStore.getGenerations(Generations);
  $scope.dataStore.getTypes(Types);

  $scope.createEffectivenessBulk = function() {
    // prep data to send
    Effectiveness.bulkCreate(checkBulkForDuplicates(parseBulkData($scope.formData)))
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
  }


  // --- helper functions ---

  function parseBulkData(inputData) {
    // parse pasted data from bulbapedia table
    // http://bulbapedia.bulbagarden.net/wiki/Type/Type_chart
    const effects = inputData.bulk.split('\n');

    let effectiveness = [];
    for (let ii = 0; ii < effects.length; ii++) {
      const e = effects[ii].split('\t');
      const attType = $scope.dataStore.getTypeIdByName(e[0]);

      for (let jj = 0; jj < effects.length; jj++) {
        const defType = $scope.dataStore.getTypeIdByName(effects[jj].substr(0, effects[jj].indexOf('\t')));
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
    let bulkDataToSend = [];
    dataToCheck.forEach((newEffect) => {
      // add every object to send array
      bulkDataToSend.push(newEffect);

      for(let i = 0; i < $scope.dataStore.effectiveness.length; i++) {
        const oldEffect = $scope.dataStore.effectiveness[i];

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
