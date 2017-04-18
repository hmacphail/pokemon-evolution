var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Learnset = sequelize.define('learnset', {
    level: {
      type: Sequelize.INTEGER
    },
    onEvo: {
      type: Sequelize.BOOLEAN
    },
    byTM: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    }
  }, {
    timestamps: false
  });
  return Learnset;
}
