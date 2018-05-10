var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Evolution = sequelize.define('Evolution', {
    trigger: {
      type: Sequelize.ENUM,
      values: ['level', 'item', 'trade', 'happiness', 'other'],
      allowNull: false
    },
    condition: {
      type: Sequelize.STRING(255)
    },
    atLevel: {
      type: Sequelize.INTEGER
    }
  }, {
    tableName: 'evolutions',
    timestamps: false
  });
  return Evolution;

};
