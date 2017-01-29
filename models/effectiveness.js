var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('effectiveness', {
    comparison: {
      type: Sequelize.ENUM,
      values: ['strong', 'neutral', 'weak', 'unaffected']
    }
  }, {
    freezeTableName: true,
    timestamps: false
  });
}