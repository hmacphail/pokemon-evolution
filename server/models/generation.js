var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Generation = sequelize.define('generation', {
    name: {
      type: Sequelize.STRING(20)
    }
  }, {
    timestamps: false,
    classMethods: {
      associate: function(db) {
        Generation.hasMany(db.Pokemon, {as: 'GenIntroduced', foreignKey: 'genIntroducedId'});
        Generation.hasMany(db.Effectiveness, {as: 'GenIntroduced', foreignKey: 'genIntroducedId'});
        Generation.hasMany(db.Effectiveness, {as: 'GenCompleted', foreignKey: 'genCompletedId'});
        Generation.hasMany(db.Skill, {as: 'GenIntroduced', foreignKey: 'genIntroducedId'});
        Generation.hasMany(db.Skillset);
        Generation.hasMany(db.Move);
        Generation.hasMany(db.Learnset, {as: 'GenIntroduced', foreignKey: 'genIntroducedId'});
        Generation.hasMany(db.Learnset, {as: 'GenCompleted', foreignKey: 'genCompletedId'});
      }
    }
  });
  return Generation;
}
