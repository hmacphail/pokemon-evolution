Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('zMove', {
    attack: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: false
  });
};
