var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var PokemonTypes = sequelize.define('PokemonTypes', {
  }, {
    tableName: 'pokemonTypes',
    timestamps: false
  });
  return PokemonTypes;

};
