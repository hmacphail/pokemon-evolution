Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('evolution', {
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
    timestamps: false
  });
};
