var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Learnset = sequelize.define('Learnset', {
    level: {
      type: Sequelize.INTEGER
    },
    onEvo: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    byTM: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    }
  }, {
    tableName: 'learnsets',
    timestamps: false,
    classMethods: {
      associate: function(db) {
        Learnset.hasMany(db.PokemonLearnsets, { foreignKey: 'learnsetId' });
      }
    }
  });
  return Learnset;

};
