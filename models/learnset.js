var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('learnset', {
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