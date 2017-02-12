var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Learnset = sequelize.define('learnset', {
    level: {
      type: Sequelize.INTEGER
    },
    byTM: {
      type: Sequelize.BOOLEAN
    }
  }, {
    timestamps: false
  });
  return Learnset;
}
