var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var PokemonStats = sequelize.define('PokemonStats', {
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
  return PokemonStats;

};
