var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Effectiveness', {
  }, {
    freezeTableName: true,
    timestamps: false
  });
}