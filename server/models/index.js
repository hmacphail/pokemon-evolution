if (!global.hasOwnProperty('db')) {
  var Sequelize = require('sequelize')
    , sequelize = null

  if (process.env.NODE_ENV) {
    // the application is executed on Heroku ... use the postgres database
    sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect:  'postgres',
      protocol: 'postgres',
      dialectOptions: {
        ssl: true
      }
    });
  } else {
    // application is executed locally ... connect to remote database with temporary credentials
    sequelize = new Sequelize('d8dvbdrannbitc', 'cganvxfjtvuhcn', '6924217d33a6155b7efcd96c287668377e1da08bf29148f593f1f4ef2644de8c', {
      host: 'ec2-54-83-194-208.compute-1.amazonaws.com',
      port: 5432,
      protocol: 'postgres',
      dialect: 'postgres',
      dialectOptions: {
        ssl: true
      }
    });
  }

  var db = {
    Sequelize: Sequelize,
    sequelize: sequelize,

    // link to model definitions and add to db variable
    Generation: sequelize.import(__dirname + '/generation'),
    Pokemon: sequelize.import(__dirname + '/pokemon'),
    Evolution: sequelize.import(__dirname + '/evolution'),
    Type: sequelize.import(__dirname + '/type'),
    Effectiveness: sequelize.import(__dirname + '/effectiveness'),
    Ability: sequelize.import(__dirname + '/ability'),
    Abilityset: sequelize.import(__dirname + '/abilityset'),
    Move: sequelize.import(__dirname + '/move'),
    Learnset: sequelize.import(__dirname + '/learnset'),
    Item: sequelize.import(__dirname + '/item'),
    PokemonTypes: sequelize.import(__dirname + '/pokemonTypes'),
    PokemonLearnset: sequelize.import(__dirname + '/pokemonLearnset'),
    User: sequelize.import(__dirname + '/user')
  }

  // global table associations
  db.Generation.hasMany(db.Pokemon, {
    as: 'GenIntroduced',
    foreignKey: {
      name:'genIntroducedId',
      allowNull: false
    }
  });
  db.Generation.hasMany(db.Effectiveness, {
    as: 'GenIntroduced',
    foreignKey: {
      name: 'genIntroducedId',
      allowNull: false
    }
  });
  db.Generation.hasMany(db.Effectiveness, {
    as: 'GenCompleted',
    foreignKey: 'genCompletedId'
  });
  db.Generation.hasMany(db.Ability, {
    as: 'GenIntroduced',
    foreignKey: {
      name: 'genIntroducedId',
      allowNull: false
    }
  });
  db.Generation.hasMany(db.Abilityset, {
    as: 'GenIntroduced',
    foreignKey: {
      name: 'genIntroducedId',
      allowNull: false
    }
  });
  db.Generation.hasMany(db.Move, {
    as: 'GenIntroduced',
    foreignKey: {
      name: 'genIntroducedId',
      allowNull: false
    }
  });
  db.Generation.hasMany(db.Move, {
    as: 'GenCompleted',
    foreignKey: 'genCompletedId'
  });
  db.Generation.hasMany(db.Learnset, {
    as: 'GenIntroduced',
    foreignKey: {
      name: 'genIntroducedId',
      allowNull: false
    }
  });
  db.Generation.hasMany(db.Learnset, {
    as: 'GenCompleted',
    foreignKey: 'genCompletedId'
  });
  db.Generation.hasMany(db.PokemonTypes, {
    as: 'GenIntroduced',
    foreignKey: {
      name: 'genIntroducedId',
      allowNull: false
    }
  });
  db.Generation.hasMany(db.PokemonTypes, {
    as: 'GenCompleted',
    foreignKey: 'genCompletedId'
  });

  db.Pokemon.hasMany(db.Evolution, {
    as: 'FromPokemon',
    foreignKey: {
      name: 'fromPokemonId',
      allowNull: false
    }
  });
  db.Pokemon.hasMany(db.Evolution, {
    as: 'ToPokemon',
    foreignKey: {
      name: 'toPokemonId',
      allowNull: false
    }
  });
  db.Pokemon.hasMany(db.Abilityset, {
    foreignKey: {
      allowNull: false
    }
  });
  db.Pokemon.hasMany(db.PokemonTypes, {
    foreignKey: {
      allowNull: false
    }
  });
  db.Pokemon.belongsToMany(db.Learnset, {
    through: db.PokemonLearnset
  });
  db.Learnset.belongsToMany(db.Pokemon, {
    through: db.PokemonLearnset
  });

  db.Type.hasMany(db.PokemonTypes, {
    as: 'PrimaryType',
    foreignKey: {
      name: 'primaryTypeId',
      allowNull: false
    }
  });
  db.Type.hasMany(db.PokemonTypes, {
    as: 'SecondaryType',
    foreignKey: 'secondaryTypeId'
  });
  db.Type.hasMany(db.Effectiveness, {
    as: 'AttackingType',
    foreignKey: {
      name: 'attackingTypeId',
      allowNull: false
    }
  });
  db.Type.hasMany(db.Effectiveness, {
    as: 'DefendingType',
    foreignKey: {
      name: 'defendingTypeId',
      allowNull: false
    }
  });
  db.Type.hasMany(db.Move, {
    foreignKey: {
      allowNull: false
    }
  });

  db.Ability.hasMany(db.Abilityset, {
    foreignKey: {
      name: 'abilityId',
      allowNull: false
    }
  });

  db.Move.hasMany(db.Learnset, {
    foreignKey: {
      allowNull: false
    }
  });

  db.Item.hasMany(db.Evolution, {
    foreignKey: {
      allowNull: false
    }
  });

}

module.exports = db;
