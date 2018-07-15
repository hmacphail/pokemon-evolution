const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  const Ability = sequelize.define('Ability', {
    name: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    description: {
      type: Sequelize.STRING(255)
    }
  }, {
    tableName: 'abilities',
    timestamps: false
  });

  Ability.associate = function(db) {
    Ability.belongsTo(db.Generation, { as: 'genIntroduced', foreignKey: { name: 'genIntroducedId', allowNull: false }});
  };

  return Ability;
};
