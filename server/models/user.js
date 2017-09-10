Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    username: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    passwordHash: {
      type: Sequelize.STRING(50),
      allowNull: false
    }
  }, {
    timestamps: false
  });
};
