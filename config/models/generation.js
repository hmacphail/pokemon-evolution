var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('generation', {
    name: {
      type: Sequelize.STRING(20)
    }
  }, {
    timestamps: false
  });
}