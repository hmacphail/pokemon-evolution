var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Game = sequelize.define('Game', {
    code: {
      type: Sequelize.STRING(20),
      allowNull: false
    },
    description: {
      type: Sequelize.STRING(255)
    }
  }, {
    tableName: 'games',
    timestamps: false,
    classMethods: {
      associate: function(db) {
        Game.hasMany(db.Abilityset, { foreignKey: 'gameId' });
        Game.hasMany(db.Move, { foreignKey: 'gameId' });
        Game.hasMany(db.PokemonLearnsets, { foreignKey: 'gameId' });
      }
    }
  });
  return Game;

};
