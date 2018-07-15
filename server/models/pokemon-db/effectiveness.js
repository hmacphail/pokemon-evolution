const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  const Effectiveness = sequelize.define('Effectiveness', {
    comparison: {
      type: Sequelize.ENUM,
      values: ['strong', 'neutral', 'weak', 'unaffected'],
      allowNull: false
    }
  }, {
    tableName: 'effectiveness',
    timestamps: false
  });

  Effectiveness.associate = function(db) {
    Effectiveness.belongsTo(db.Generation, { as: 'genIntroduced', foreignKey: { name: 'genIntroducedId', allowNull: false}});
    Effectiveness.belongsTo(db.Generation, { as: 'genCompleted', foreignKey: 'genCompletedId' });
    Effectiveness.belongsTo(db.Type, { as: 'attackingType', foreignKey: { name: 'attackingTypeId', allowNull: false }});
    Effectiveness.belongsTo(db.Type, { as: 'defendingType', foreignKey: { name: 'defendingTypeId', allowNull: false }});
  };

  return Effectiveness;
};
