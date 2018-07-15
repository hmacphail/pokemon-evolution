const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  const Abilityset = sequelize.define('Abilityset', {
    trait: {
      type: Sequelize.ENUM,
      values: ['primary', 'secondary', 'hidden'],
      allowNull: false
    },
  }, {
    tableName: 'abilitysets',
    timestamps: false
  });

  Abilityset.associate = function(db) {
    Abilityset.belongsTo(db.Ability, { foreignKey: { name: 'abilityId', allowNull: false }});
    Abilityset.belongsTo(db.Game, { foreignKey: 'gameId' });
    Abilityset.belongsTo(db.Generation, { as: 'genIntroduced', foreignKey: { name: 'genIntroducedId', allowNull: false }});
    Abilityset.belongsTo(db.Generation, { as: 'genCompleted', foreignKey: 'genCompletedId' });
    Abilityset.belongsTo(db.Pokemon, { foreignKey: { name: 'pokemonId', allowNull: false }});
  };

  return Abilityset;
};
