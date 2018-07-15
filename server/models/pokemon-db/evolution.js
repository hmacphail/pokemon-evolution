const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  const Evolution = sequelize.define('Evolution', {
    trigger: {
      type: Sequelize.ENUM,
      values: ['level', 'item', 'trade', 'happiness', 'other'],
      allowNull: false
    },
    condition: {
      type: Sequelize.STRING(255)
    },
    atLevel: {
      type: Sequelize.INTEGER
    }
  }, {
    tableName: 'evolution',
    timestamps: false
  });

  Evolution.associate = function(db) {
    Evolution.belongsTo(db.Item, { foreignKey: 'itemId' });
    Evolution.belongsTo(db.Pokemon, { as: 'fromPokemon', foreignKey: { name: 'fromPokemonId', allowNull: false }});
    Evolution.belongsTo(db.Pokemon, { as: 'toPokemon', foreignKey: { name: 'toPokemonId', allowNull: false }});
  };

  return Evolution;
};
