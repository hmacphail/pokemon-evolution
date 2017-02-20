var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Evolution = sequelize.define('evolution', {
    trigger: {
      type: Sequelize.ENUM,
      values: ['level', 'item', 'trade', 'happiness', 'other']
    },
    condition: {
      type: Sequelize.STRING(255)
    },
    atLevel: {
      type: Sequelize.INTEGER
    },
    form: {
      type: Sequelize.STRING(50)
    }
  }, {
    timestamps: false
  });
  return Evolution;
}
