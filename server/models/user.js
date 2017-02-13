var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('type', {
    username: {
      type: Sequelize.STRING(50)
    },
    password: {
      type: Sequelize.STRING(50)
    }
  }, {
    timestamps: false
  });
  return User;
}
