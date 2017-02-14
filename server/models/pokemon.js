var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Pokemon = sequelize.define('pokemon', {
    pokedexId: {
      type: Sequelize.INTEGER
    },
    name: {
      type: Sequelize.STRING(20)
    },
    form: {
      type: Sequelize.ENUM,
      values: ['original', 'alola']
    }
  }, {
    freezeTableName: true,
    timestamps: false,
    classMethods: {
      associate: function(db) {
        Pokemon.hasMany(db.Evolution, {as: 'FromPokemon', foreignKey: 'fromPokemonId'});
        Pokemon.hasMany(db.Evolution, {as: 'ToPokemon', foreignKey: 'toPokemonId'});
        Pokemon.hasMany(db.Skillset);
        Pokemon.hasMany(db.Learnset);
      }
    }
  });
  return Pokemon;
}
