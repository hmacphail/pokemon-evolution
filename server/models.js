Sequelize = require('sequelize');
let db = {};

if (!global.hasOwnProperty('db')) {
  let sequelize = null;

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
    // application is executed locally ... local install of Postgres
    sequelize = new Sequelize('dev-pokelution', 'postgres', 'mareep', {
      host: '192.168.0.134',
      port: 5432,
      protocol: 'postgres',
      dialect: 'postgres',
      dialectOptions: {
        ssl: true
      }
    });

    // jaws db connection string
  /*let sequelize = new Sequelize('jp41rk8gc3x9jb7h', 'xfxbjt9ip3wfij77', 'kbdyuxmcr3xx3knk', {
    host: 'wftuqljwesiffol6.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    port: 3306,
    dialect: 'mysql'
  });*/
  }

  db = {
    Sequelize: Sequelize,
    sequelize: sequelize,

    // link to model definitions and add to db variable
    Generation: sequelize.import('./models/generation'),
    Pokemon: sequelize.import('./models/pokemon'),
    Evolution: sequelize.import('./models/evolution'),
    Type: sequelize.import('./models/type'),
    Effectiveness: sequelize.import('./models/effectiveness'),
    Ability: sequelize.import('./models/ability'),
    Abilityset: sequelize.import('./models/abilityset'),
    Move: sequelize.import('./models/move'),
    Learnset: sequelize.import('./models/learnset'),
    Item: sequelize.import('./models/item'),
    PokemonTypes: sequelize.import('./models/pokemonTypes'),
    Game: sequelize.import('./models/game'),
    PokemonLearnsets: sequelize.import('./models/pokemonLearnsets'),
    User: sequelize.import('./models/user'),
  };

  // global table associations
  db.Generation.hasMany(db.Pokemon, {
    as: 'genIntroduced',
    foreignKey: {
      name: 'genIntroducedId',
      allowNull: false
    }
  });
  db.Generation.hasMany(db.Effectiveness, {
    as: 'genIntroduced',
    foreignKey: {
      name: 'genIntroducedId',
      allowNull: false
    }
  });
  db.Generation.hasMany(db.Effectiveness, {
    as: 'genCompleted',
    foreignKey: 'genCompletedId'
  });
  db.Generation.hasMany(db.Ability, {
    as: 'genIntroduced',
    foreignKey: {
      name: 'genIntroducedId',
      allowNull: false
    }
  });
  db.Generation.hasMany(db.Abilityset, {
    as: 'genIntroduced',
    foreignKey: {
      name: 'genIntroducedId',
      allowNull: false
    }
  });
  db.Generation.hasMany(db.Abilityset, {
    as: 'genCompleted',
    foreignKey: 'genCompletedId'
  });
  db.Generation.hasMany(db.Move, {
    as: 'genIntroduced',
    foreignKey: {
      name: 'genIntroducedId',
      allowNull: false
    }
  });
  db.Generation.hasMany(db.Move, {
    as: 'genCompleted',
    foreignKey: 'genCompletedId'
  });
  db.Generation.hasMany(db.PokemonTypes, {
    as: 'genIntroduced',
    foreignKey: {
      name: 'genIntroducedId',
      allowNull: false
    }
  });
  db.Generation.hasMany(db.PokemonTypes, {
    as: 'genCompleted',
    foreignKey: 'genCompletedId'
  });
  db.Generation.hasMany(db.Game, {
    foreignKey: {
      allowNull: false
    }
  });
  db.Generation.hasMany(db.PokemonLearnsets, {
    as: 'genIntroduced',
    foreignKey: {
      name: 'genIntroducedId',
      allowNull: false
    }
  });
  db.Generation.hasMany(db.PokemonLearnsets, {
    as: 'genCompleted',
    foreignKey: 'genCompletedId'
  });

  db.Pokemon.hasMany(db.Evolution, {
    as: 'fromPokemon',
    foreignKey: {
      name: 'fromPokemonId',
      allowNull: false
    }
  });
  db.Pokemon.hasMany(db.Evolution, {
    as: 'toPokemon',
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
  db.Pokemon.hasMany(db.PokemonLearnsets, {
    foreignKey: {
      allowNull: false
    }
  });

  db.Type.hasMany(db.PokemonTypes, {
    as: 'primaryType',
    foreignKey: {
      name: 'primaryTypeId',
      allowNull: false
    }
  });
  db.Type.hasMany(db.PokemonTypes, {
    as: 'secondaryType',
    foreignKey: 'secondaryTypeId'
  });
  db.Type.hasMany(db.Effectiveness, {
    as: 'attackingType',
    foreignKey: {
      name: 'attackingTypeId',
      allowNull: false
    }
  });
  db.Type.hasMany(db.Effectiveness, {
    as: 'defendingType',
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

  db.Learnset.hasMany(db.PokemonLearnsets, {
    foreignKey: 'learnsetId'
  });

  db.Item.hasMany(db.Evolution, {
    foreignKey: 'itemId'
  });

  db.Game.hasMany(db.Abilityset, {
    foreignKey: 'gameId'
  });
  db.Game.hasMany(db.Move, {
    foreignKey: 'gameId'
  });
  db.Game.hasMany(db.PokemonLearnsets, {
    foreignKey: 'gameId'
  });

}

module.exports = db;
