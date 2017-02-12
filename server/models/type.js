var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Type = sequelize.define('type', {
    name: {
      type: Sequelize.STRING(20)
    }
  }, {
    timestamps: false,
    classMethods: {
      associate: function(db) {
        Type.hasMany(db.Pokemon, {as: 'PrimaryType', foreignKey: 'primaryTypeId'});
        Type.hasMany(db.Pokemon, {as: 'SecondaryType', foreignKey: 'secondaryTypeId'});
        Type.hasMany(db.Effectiveness, {as: 'AttackingType', foreignKey: 'attackingTypeId'});
        Type.hasMany(db.Effectiveness, {as: 'DefendingType', foreignKey: 'defendingTypeId'});
        Type.hasMany(db.Move);
      }
    }
  });
  return Type;
}
