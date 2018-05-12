var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Type = sequelize.define('Type', {
    name: {
      type: Sequelize.STRING(20),
      allowNull: false
    }
  }, {
    tableName: 'types',
    timestamps: false,
    classMethods: {
      associate: function(db) {
				Type.hasMany(db.PokemonTypes, { as: 'primaryType', foreignKey: { name: 'primaryTypeId', allowNull: false }});
				Type.hasMany(db.PokemonTypes, { as: 'secondaryType', foreignKey: 'secondaryTypeId' });
				Type.hasMany(db.Effectiveness, { as: 'attackingType', foreignKey: { name: 'attackingTypeId', allowNull: false }});
				Type.hasMany(db.Effectiveness, { as: 'defendingType', foreignKey: { name: 'defendingTypeId', allowNull: false }});
				Type.hasMany(db.Move, { foreignKey: { allowNull: false }});
      }
	}
  });
  return Type;

};
