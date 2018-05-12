var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Generation = sequelize.define('Generation', {
    name: {
      type: Sequelize.STRING(20),
      allowNull: false
    }
  }, {
    tableName: 'generations',
    timestamps: false,
    classMethods: {
      associate: function(db) {
        Generation.hasMany(db.Pokemon, { as: 'genIntroduced', foreignKey: { name: 'genIntroducedId', allowNull: false }});
        Generation.hasMany(db.Effectiveness, { as: 'genIntroduced', foreignKey: { name: 'genIntroducedId', allowNull: false}});
        Generation.hasMany(db.Effectiveness, { as: 'genCompleted', foreignKey: 'genCompletedId' });
        Generation.hasMany(db.Ability, { as: 'genIntroduced', foreignKey: { name: 'genIntroducedId', allowNull: false }});
        Generation.hasMany(db.Abilityset, { as: 'genIntroduced', foreignKey: { name: 'genIntroducedId', allowNull: false }});
        Generation.hasMany(db.Abilityset, { as: 'genCompleted', foreignKey: 'genCompletedId' });
        Generation.hasMany(db.Move, { as: 'genIntroduced', foreignKey: { name: 'genIntroducedId', allowNull: false }});
        Generation.hasMany(db.Move, { as: 'genCompleted', foreignKey: 'genCompletedId' });
        Generation.hasMany(db.PokemonTypes, { as: 'genIntroduced', foreignKey: { name: 'genIntroducedId', allowNull: false }});
        Generation.hasMany(db.PokemonTypes, { as: 'genCompleted', foreignKey: 'genCompletedId' });
        Generation.hasMany(db.Game, { foreignKey: { name: 'generationId', allowNull: false }});
        Generation.hasMany(db.PokemonLearnsets, { as: 'genIntroduced', foreignKey: { name: 'genIntroducedId', allowNull: false }});
        Generation.hasMany(db.PokemonLearnsets, { as: 'genCompleted', foreignKey: 'genCompletedId' });
      }
    }
  });
  return Generation;

};
