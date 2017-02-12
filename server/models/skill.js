var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Skill = sequelize.define('skill', {
    name: {
      type: Sequelize.STRING(20)
    }
  }, {
    timestamps: false,
    classMethods: {
      associate: function(db) {
        Skill.hasMany(db.Skillset);
      }
    }
  });
  return Skill;
}
