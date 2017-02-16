var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Move = sequelize.define('move', {
    name: {
      type: Sequelize.STRING(50)
    },
    isTM: {
      type: Sequelize.BOOLEAN
    },
    pp: {
      type: Sequelize.INTEGER
    },
    power: {
      type: Sequelize.INTEGER
    },
    accuracy: {
      type: Sequelize.FLOAT
    },
    category: {
      type: Sequelize.ENUM,
      values: ['physical', 'special', 'status']
    },
    extraInfo: {
      type: Sequelize.STRING(50)
    },
    extraInfoColumn: {
      type: Sequelize.STRING(50)
    },
    description: {
      type: Sequelize.STRING(255)
    }
  }, {
    timestamps: false
  });
  return Move;
}
