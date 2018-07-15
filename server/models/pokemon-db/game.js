const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  const Game = sequelize.define('Game', {
    code: {
      type: Sequelize.STRING(20),
      allowNull: false
    },
    name: {
      type: Sequelize.STRING(255)
    }
  }, {
    tableName: 'games',
    timestamps: false
  });

  Game.associate = function(db) {
    Game.belongsTo(db.Generation, { foreignKey: { name: 'generationId', allowNull: false }});
  };

  return Game;
};
