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
    Skill: sequelize.import(__dirname + '/skill'),
    Skillset: sequelize.import(__dirname + '/skillset'),
    Move: sequelize.import(__dirname + '/move'),
    Learnset: sequelize.import(__dirname + '/learnset'),
    Item: sequelize.import(__dirname + '/item'),
    User: sequelize.import(__dirname + '/user')
  }
}

module.exports = db;
