var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var PokemonLearnsets = sequelize.define('pokemonLearnsets', {
  }, {
    freezeTableName: true,
    timestamps: false
  });
  return PokemonLearnsets;
}
