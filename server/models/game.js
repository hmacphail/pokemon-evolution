Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('game', {
    code: {
      type: Sequelize.STRING(20),
      allowNull: false
    },
    name: {
      type: Sequelize.STRING(255)
    }
  }, {
    timestamps: false
  });
};
