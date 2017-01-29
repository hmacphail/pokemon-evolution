var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Pokemon', {
    pokedexId: {
      type: Sequelize.FLOAT
    },
    name: {
      type: Sequelize.STRING(20)
    },

  }, {
    freezeTableName: true,
    timestamps: false
  });
}