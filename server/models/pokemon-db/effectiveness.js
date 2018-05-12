var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Effectiveness = sequelize.define('Effectiveness', {
    comparison: {
      type: Sequelize.ENUM,
      values: ['strong', 'neutral', 'weak', 'unaffected'],
      allowNull: false
    }
  }, {
    tableName: 'effectiveness',
    timestamps: false
  });
  return Effectiveness;

};
