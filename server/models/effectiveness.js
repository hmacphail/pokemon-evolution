var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Effectiveness = sequelize.define('effectiveness', {
    comparison: {
      type: Sequelize.ENUM,
      values: ['strong', 'neutral', 'weak', 'unaffected']
    }
  }, {
    freezeTableName: true,
    timestamps: false
  });
  return Effectiveness;
}
