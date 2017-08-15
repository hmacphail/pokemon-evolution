var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Game = sequelize.define('game', {
    code: {
      type: Sequelize.STRING(20),
      allowNull: false
    },
    name: {
      type: Sequelize.STRING(255)
    }
  }, {
    timestamps: false
  });
  return Game;
}
