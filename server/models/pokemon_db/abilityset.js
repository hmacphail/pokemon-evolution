var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Abilityset = sequelize.define('Abilityset', {
    trait: {
      type: Sequelize.ENUM,
      values: ['primary', 'secondary', 'hidden'],
      allowNull: false
    },
  }, {
    tableName: 'abilitysets',
    timestamps: false
  });
  return Abilityset;

};
