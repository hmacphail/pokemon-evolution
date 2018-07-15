const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  const Pokemon = sequelize.define('Pokemon', {
    pokedexId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    form: {
      type: Sequelize.ENUM,
      values: ['original', 'mega', 'alolan'],
      allowNull: false,
      defaultValue: 'original'
    },
    variation: {
      type: Sequelize.STRING(50)
    }
  }, {
    tableName: 'pokemon',
    timestamps: false
  });

  Pokemon.associate = function(db) {
    Pokemon.belongsTo(db.Generation, { as: 'genIntroduced', foreignKey: { name: 'genIntroducedId', allowNull: false }});
  };

  return Pokemon;
};
