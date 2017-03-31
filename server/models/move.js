var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Move = sequelize.define('move', {
    name: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    isTM: {
      type: Sequelize.BOOLEAN
    },
    pp: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    power: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    accuracy: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    category: {
      type: Sequelize.ENUM,
      values: ['physical', 'special', 'status'],
      allowNull: false
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
