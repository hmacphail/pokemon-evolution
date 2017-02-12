var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Move = sequelize.define('move', {
    name: {
      type: Sequelize.STRING(20)
    },
    isTM: {
      type: Sequelize.BOOLEAN
    }
  }, {
    timestamps: false,
    classMethods: {
      associate: function(db) {
        Move.hasMany(db.Learnset);
      }
    }
  });
  return Move;
}
