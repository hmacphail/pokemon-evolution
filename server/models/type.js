var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Type = sequelize.define('type', {
    name: {
      type: Sequelize.STRING(20)
    }
  }, {
    timestamps: false
  });
  return Type;
}
