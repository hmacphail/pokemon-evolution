Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('item', {
    name: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    description: {
      type: Sequelize.STRING(255)
    }
  }, {
    timestamps: false
  });
};
