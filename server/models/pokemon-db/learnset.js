const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  const Learnset = sequelize.define('Learnset', {
    level: {
      type: Sequelize.INTEGER
    },
    onEvo: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    byTM: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    tableName: 'learnsets',
    timestamps: false
  });

  Learnset.associate = function(db) {
    Learnset.belongsTo(db.Move, { foreignKey: { name: 'moveId', allowNull: false }});
  };

  return Learnset;
};
