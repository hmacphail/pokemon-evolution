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
      values: ['original', 'alolan']
    }
  }, {
    freezeTableName: true,
    timestamps: false
  });
  return Pokemon;
}
