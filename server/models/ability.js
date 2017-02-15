var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Ability = sequelize.define('abilities', {
    name: {
      type: Sequelize.STRING(20)
    },
    description: {
      type: Sequelize.STRING(255)
    }
  }, {
    freezeTableName: true,
    timestamps: false
  });
  return Ability;
}
