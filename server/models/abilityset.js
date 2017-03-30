var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Abilityset = sequelize.define('abilityset', {
    trait: {
      type: Sequelize.ENUM,
      values: ['primary', 'secondary', 'hidden']
    },
  }, {
    timestamps: false
  });
  return Abilityset;
}
