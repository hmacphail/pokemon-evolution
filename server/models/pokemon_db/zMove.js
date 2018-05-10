var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var ZMove = sequelize.define('ZMove', {
    attack: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'zMoves',
    timestamps: false
  });
  return ZMove;

};
