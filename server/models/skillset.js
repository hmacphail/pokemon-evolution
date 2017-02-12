var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Skillset = sequelize.define('skillset', {
  }, {
    timestamps: false
  });
  return Skillset;
}
