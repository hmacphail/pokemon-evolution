var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var PokemonLearnsets = sequelize.define('PokemonLearnsets', {
  }, {
    tableName: 'pokemonLearnsets',
    timestamps: false
  });
  return PokemonLearnsets;

};
