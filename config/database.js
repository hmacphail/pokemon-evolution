if (!global.hasOwnProperty('db')) {
  var Sequelize = require('sequelize')
    , sequelize = null

  if (process.env.DATABASE_URL) {
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
    Generation: sequelize.import(__dirname + '/models/generation'),
    Pokemon: sequelize.import(__dirname + '/models/pokemon'),
    Evolution: sequelize.import(__dirname + '/models/evolution'),
    Type: sequelize.import(__dirname + '/models/type'),
    Effectiveness: sequelize.import(__dirname + '/models/effectiveness'),
    Skill: sequelize.import(__dirname + '/models/skill'),
    Skillset: sequelize.import(__dirname + '/models/skillset'),
    Move: sequelize.import(__dirname + '/models/move'),
    Learnset: sequelize.import(__dirname + '/models/learnset'),
    Item: sequelize.import(__dirname + '/models/item')
  }
  // global table associations
  db.Generation.hasMany(db.Pokemon, {as: 'GenIntroduced', foreignKey: 'genIntroducedId'});
  db.Generation.hasMany(db.Effectiveness, {as: 'GenIntroduced', foreignKey: 'genIntroducedId'});
  db.Generation.hasMany(db.Effectiveness, {as: 'GenCompleted', foreignKey: 'genCompletedId'});
  db.Generation.hasMany(db.Skill, {as: 'GenIntroduced', foreignKey: 'genIntroducedId'});
  db.Generation.hasMany(db.Skillset);
  db.Generation.hasMany(db.Move);
  db.Generation.hasMany(db.Learnset, {as: 'GenIntroduced', foreignKey: 'genIntroducedId'});
  db.Generation.hasMany(db.Learnset, {as: 'GenCompleted', foreignKey: 'genCompletedId'});

  db.Pokemon.hasMany(db.Evolution, {as: 'FromPokemon', foreignKey: 'fromPokemonId'});
  db.Pokemon.hasMany(db.Evolution, {as: 'ToPokemon', foreignKey: 'toPokemonId'});
  db.Pokemon.hasMany(db.Skillset);
  db.Pokemon.hasMany(db.Learnset);

  db.Type.hasMany(db.Pokemon, {as: 'PrimaryType', foreignKey: 'primaryTypeId'});
  db.Type.hasMany(db.Pokemon, {as: 'SecondaryType', foreignKey: 'secondaryTypeId'});
  db.Type.hasMany(db.Effectiveness, {as: 'AttackingType', foreignKey: 'attackingTypeId'});
  db.Type.hasMany(db.Effectiveness, {as: 'DefendingType', foreignKey: 'defendingTypeId'});
  db.Type.hasMany(db.Move);

  db.Skill.hasMany(db.Skillset);

  db.Move.hasMany(db.Learnset);

  db.Item.hasMany(db.Evolution);

}

module.exports = db;