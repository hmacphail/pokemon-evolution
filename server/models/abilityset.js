var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Abilityset = sequelize.define('abilityset', {
  }, {
    timestamps: false
  });
  return Abilityset;
}