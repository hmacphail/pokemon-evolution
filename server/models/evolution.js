var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Evolution = sequelize.define('evolution', {
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
  return Evolution;
}
