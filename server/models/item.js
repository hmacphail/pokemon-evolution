var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Item = sequelize.define('item', {
    name: {
      type: Sequelize.STRING(20)
    },
    description: {
      type: Sequelize.STRING(255)
    }
  }, {
    timestamps: false,
    classMethods: {
      associate: function(db) {
        Item.hasMany(db.Evolution);
      }
    }
  });
  return Item;
}
