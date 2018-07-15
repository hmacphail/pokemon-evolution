const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  const Item = sequelize.define('Item', {
    name: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    description: {
      type: Sequelize.STRING(255)
    }
  }, {
    tableName: 'items',
    timestamps: false
  });

  return Item;
};
