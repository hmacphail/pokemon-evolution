const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  const Move = sequelize.define('Move', {
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
      type: Sequelize.ENUM,
      values: [
        'special',
        'user',
        'ally',
        'user-or-ally',
        'users-field',
        'selected-opponent',
        'random-opponent',
        'adjacent-opponents',
        'opponents-field',
        'all-others',
        'entire-field'
      ],
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
    tableName: 'moves',
    timestamps: false
  });

  Move.associate = function(db) {
    Move.belongsTo(db.Game, { foreignKey: 'gameId' });
    Move.belongsTo(db.Generation, { as: 'genIntroduced', foreignKey: { name: 'genIntroducedId', allowNull: false }});
    Move.belongsTo(db.Generation, { as: 'genCompleted', foreignKey: 'genCompletedId' });
    Move.belongsTo(db.Move, { as: 'commonMove', foreignKey: { name: 'commonMoveId' }});
    Move.belongsTo(db.MoveFlags, { foreignKey: { name: 'moveFlagId', allowNull: false }});
    Move.belongsTo(db.Type, { foreignKey: { name: 'typeId', allowNull: false }});
  };

  return Move;
};
