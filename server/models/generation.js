var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Generation = sequelize.define('generation', {
    name: {
      type: Sequelize.STRING(20),
      allowNull: false
    }
  }, {
    timestamps: false
  });
  return Generation;
}
