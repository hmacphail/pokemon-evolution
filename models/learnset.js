var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Learnset', {
    level: {
      type: Sequelize.INTEGER
    },
    byTM: {
      type: Sequelize.BOOLEAN
    }
  }, {
    timestamps: false
  });
}