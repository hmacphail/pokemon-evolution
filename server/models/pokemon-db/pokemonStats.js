const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  const PokemonStats = sequelize.define('PokemonStats', {
    baseHp: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    baseAttack: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    baseDefence: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    baseSpAttack: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    baseSpDefence: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    baseSpeed: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'pokemonStats',
    timestamps: false
  });

  PokemonStats.associate = function(db) {
    PokemonStats.belongsTo(db.Pokemon, { foreignKey: { name: 'pokemonId', allowNull: false }});
  };

  return PokemonStats;
};
