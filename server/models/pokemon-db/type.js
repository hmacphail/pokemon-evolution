const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  const Type = sequelize.define('Type', {
    name: {
      type: Sequelize.STRING(20),
      allowNull: false
    }
  }, {
    tableName: 'types',
    timestamps: false
  });

  return Type;
};
