var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Learnset = sequelize.define('learnset', {
    level: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    byTM: {
      type: Sequelize.BOOLEAN
    }
  }, {
    timestamps: false
  });
  return Learnset;
}
