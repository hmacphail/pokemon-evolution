const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  const Generation = sequelize.define('Generation', {
    name: {
      type: Sequelize.STRING(20),
      allowNull: false
    }
  }, {
    tableName: 'generations',
    timestamps: false
  });

  return Generation;
};
