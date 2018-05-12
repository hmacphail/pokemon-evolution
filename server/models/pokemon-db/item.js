var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Item = sequelize.define('Item', {
    name: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    description: {
      type: Sequelize.STRING(255)
    }
  }, {
    tableName: 'items',
    timestamps: false,
    classMethods: {
      associate: function(db) {
        Item.hasMany(db.Evolution, { foreignKey: 'itemId' });
      }
    }
  });
  return Item;

};
