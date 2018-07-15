const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  const PokemonTypes = sequelize.define('PokemonTypes', {
  }, {
    tableName: 'pokemonTypes',
    timestamps: false
  });

  PokemonTypes.associate = function(db) {
    PokemonTypes.belongsTo(db.Generation, { as: 'genIntroduced', foreignKey: { name: 'genIntroducedId', allowNull: false }});
    PokemonTypes.belongsTo(db.Generation, { as: 'genCompleted', foreignKey: 'genCompletedId' });
    PokemonTypes.belongsTo(db.Pokemon, { foreignKey: { name: 'pokemonId', allowNull: false }});
    PokemonTypes.belongsTo(db.Type, { as: 'primaryType', foreignKey: { name: 'primaryTypeId', allowNull: false }});
    PokemonTypes.belongsTo(db.Type, { as: 'secondaryType', foreignKey: 'secondaryTypeId' });
  };

  return PokemonTypes;
};
