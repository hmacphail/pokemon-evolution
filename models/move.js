var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Move', {
    name: {
      type: Sequelize.STRING(20)
    },
    isTM: {
      type: Sequelize.BOOLEAN
    }
  }, {
    timestamps: false
  });
}