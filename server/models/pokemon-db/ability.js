var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Ability = sequelize.define('Ability', {
    name: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    description: {
      type: Sequelize.STRING(255)
    }
  }, {
    tableName: 'abilities',
    timestamps: false,
    classMethods: {
      associate: function(db) {
        Ability.hasMany(db.Abilityset, { foreignKey: { name: 'abilityId', allowNull: false }});
      }
    }
  });
  return Ability;

};
