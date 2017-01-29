var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Pokemon', {
    name: {
      type: Sequelize.STRING,
      field: 'pokemon_name'
    },
    pokedexId: {
      type: Sequelize.INTEGER,
      field: 'id'
    }
  }, {
    freezeTableName: true, // Model tableName will be the same as the model name
    tableName: 'pokemon',
    timestamps: false
  });
}