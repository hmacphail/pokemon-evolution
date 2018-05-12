var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Pokemon = sequelize.define('Pokemon', {
    pokedexId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    form: {
      type: Sequelize.ENUM,
      values: ['original', 'mega', 'alolan'],
      allowNull: false,
      defaultValue: 'original'
    },
    variation: {
      type: Sequelize.STRING(50)
    }
  }, {
    tableName: 'pokemon',
    timestamps: false,
    classMethods: {
      associate: function(db) {
        Pokemon.hasMany(db.Evolution, { as: 'fromPokemon', foreignKey: { name: 'fromPokemonId', allowNull: false }});
        Pokemon.hasMany(db.Evolution, { as: 'toPokemon', foreignKey: { name: 'toPokemonId', allowNull: false }});
        Pokemon.hasMany(db.Abilityset, { foreignKey: { allowNull: false }});
        Pokemon.hasMany(db.PokemonStats, { foreignKey: { allowNull: false }});
        Pokemon.hasMany(db.PokemonTypes, { foreignKey: { allowNull: false }});
        Pokemon.hasMany(db.PokemonLearnsets, { foreignKey: { allowNull: false }});
      }
    }
  });
  return Pokemon;

};
