var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var PokemonLearnset = sequelize.define('pokemonLearnset', {
  }, {
    timestamps: false
  });
  return PokemonLearnset;
}
