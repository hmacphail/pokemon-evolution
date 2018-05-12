var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var MoveFlags = sequelize.define('MoveFlags', {
    blockable: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    reflectable: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    snatchable: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    copiedByMirrorMove: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    soundBased: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    punchBased: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    affectedByGravity: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    affectedByKingsRock: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    tableName: 'moveFlags',
    timestamps: false,
    classMethods: {
      associate: function(db) {
        MoveFlags.hasMany(db.Move, { foreignKey: { allowNull: false }});
      }
    }
  });
  return MoveFlags;

};
