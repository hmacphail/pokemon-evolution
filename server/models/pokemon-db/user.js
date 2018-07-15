const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define('User', {
    username: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    passwordHash: {
      type: Sequelize.STRING(50),
      allowNull: false
    }
  }, {
    tableName: 'users',
    timestamps: false
  });

  return User;
};
