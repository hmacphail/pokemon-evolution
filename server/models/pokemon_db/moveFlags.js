var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var MoveFlags = sequelize.define('MoveFlags', {
    blockable: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    reflectable: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    snatchable: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    copiedByMirrorMove: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    soundBased: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    punchBased: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    affectedByGravity: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    affectedByKingsRock: {
      type: Sequelize.BOOLEAN,
      allowNull: false
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
