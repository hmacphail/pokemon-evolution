var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Pokemon = sequelize.define('pokemon', {
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
    freezeTableName: true,
    timestamps: false
  });
  return Pokemon;
}
