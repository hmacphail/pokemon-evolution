Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pokemonStats', {
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
    freezeTableName: true,
    timestamps: false
  });
};
