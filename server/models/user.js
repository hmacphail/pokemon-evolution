var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('user', {
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
  return User;
}
