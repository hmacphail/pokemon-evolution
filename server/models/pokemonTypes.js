var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var PokemonTypes = sequelize.define('pokemonTypes', {
  }, {
    freezeTableName: true,
    timestamps: false
  });
  return PokemonTypes;
}
