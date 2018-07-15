const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  const ZMove = sequelize.define('ZMove', {
    attack: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'zMoves',
    timestamps: false
  });

  ZMove.associate = function(db) {
    ZMove.belongsTo(db.Move, { as: 'zMove', foreignKey: { name: 'zMoveId', allowNull: false }});
    ZMove.belongsTo(db.Move, { as: 'originalMove', foreignKey: { name: 'originalMoveId', allowNull: false }});
  };

  return ZMove;
};
