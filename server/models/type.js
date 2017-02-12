var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('type', {
    name: {
      type: Sequelize.STRING(20)
    }
  }, {
    timestamps: false
  });
}