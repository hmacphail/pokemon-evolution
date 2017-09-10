Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('abilityset', {
    trait: {
      type: Sequelize.ENUM,
      values: ['primary', 'secondary', 'hidden'],
      allowNull: false
    },
  }, {
    timestamps: false
  });
};
