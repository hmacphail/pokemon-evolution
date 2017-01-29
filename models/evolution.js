var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('evolution', {
    trigger: {
      type: Sequelize.ENUM,
      values: ['level', 'item', 'trade']
    },
    atLevel: {
      type: Sequelize.INTEGER
    }
  }, {
    freezeTableName: true,
    timestamps: false
  });
}