const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  const PokemonLearnsets = sequelize.define('PokemonLearnsets', {
  }, {
    tableName: 'pokemonLearnsets',
    timestamps: false
  });

  PokemonLearnsets.associate = function(db) {
    PokemonLearnsets.belongsTo(db.Game, { foreignKey: 'gameId' });
    PokemonLearnsets.belongsTo(db.Generation, { as: 'genIntroduced', foreignKey: { name: 'genIntroducedId', allowNull: false }});
    PokemonLearnsets.belongsTo(db.Generation, { as: 'genCompleted', foreignKey: 'genCompletedId' });
    PokemonLearnsets.belongsTo(db.Learnset, { foreignKey: 'learnsetId' });
    PokemonLearnsets.belongsTo(db.Pokemon, { foreignKey: { name: 'pokemonId', allowNull: false }});
  };

  return PokemonLearnsets;
};
