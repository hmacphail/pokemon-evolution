Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pokemonLearnsets', {
  }, {
    freezeTableName: true,
    timestamps: false
  });
};
