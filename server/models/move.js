Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('move', {
    name: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    pp: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    power: {
      type: Sequelize.INTEGER
    },
    accuracy: {
      type: Sequelize.FLOAT
    },
    category: {
      type: Sequelize.ENUM,
      values: ['physical', 'special', 'status'],
      allowNull: false
    },
    target: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    speedPriority: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    baseCritHitChance: {
      type: Sequelize.FLOAT
    },
    physicalContact: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    secondaryEffect: {
      type: Sequelize.STRING(255)
    },
    secondaryEffectRate: {
      type: Sequelize.FLOAT
    },
    description: {
      type: Sequelize.STRING(255)
    },
    tmNumber: {
      type: Sequelize.STRING(20)
    },
    hmNumber: {
      type: Sequelize.STRING(20)
    }
  }, {
    timestamps: false
  });
};
