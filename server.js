// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
var http    = require('http');
var pg = require('pg');                    // postgres db connection
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var Sequelize = require('sequelize');
//var routes = require('./routes');
var db = require('./models');

// configuration =================

//pg.defaults.ssl = true;
/*
var config = {
  host: 'ec2-54-83-194-208.compute-1.amazonaws.com',
  port: 5432,
  database: 'd8dvbdrannbitc',
  user: 'cganvxfjtvuhcn',
  password: '6924217d33a6155b7efcd96c287668377e1da08bf29148f593f1f4ef2644de8c',
  ssl: true
};

//console.log(process.env.DATABASE_URL);

pg.connect(config, function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');

  client
    .query('SELECT * FROM pokemon;')
    .on('row', function(row) {
      console.log(JSON.stringify(row));
    });
});
*/
//var sequelize = new Sequelize('postgres://cganvxfjtvuhcn:6924217d33a6155b7efcd96c287668377e1da08bf29148f593f1f4ef2644de8c@ec2-54-83-194-208.compute-1.amazonaws.com:5432/d8dvbdrannbitc?ssl=on');

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

//app.get('/', routes.index);
//app.get('/pokemon', pokemon.list);

app.port = process.env.PORT || 5000;

db.sequelize.sync().then(function() {
  http.createServer(app).listen(app.port, function(){
    console.log('Express server listening on port ' + app.port);
  });
});

// define model =================
/*var Pokemon = sequelize.define('Pokemon', {
  name: {
    type: Sequelize.STRING,
    field: 'pokemon_name'
  },
  pokedexId: {
    type: Sequelize.INTEGER,
    field: 'pokemon_id'
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});*/


// listen (start app with node server.js) ======================================
//app.listen(8080);
//console.log("App listening on port 8080");

// routes ======================================================================

// api ---------------------------------------------------------------------
// get all generations
app.get('/api/generations', function(req, res) {

    // use sequelize to get all generations in the database
    db.Generation.findAll().then(function(generations) {
        res.json(generations); // return all generations in JSON format
    });
});

// create generation and send back all generations after creation
app.post('/api/generation', function(req, res) {

    // create a todo, information comes from AJAX request from Angular
    db.Generation.create({
      name: req.body.text,
    }).then(function() {

        // get and return all the generations after you create another
        db.Generation.findAll().then(function(generations) {
            res.json(generations);
        });
    });

});

// delete a generation
app.delete('/api/generation/:generation_id', function(req, res) {
    db.Generation.destroy({ where:
      { id: req.params.generation_id }
    }).then(function() {

        // get and return all the generations after you delete one
        db.Generation.findAll().then(function(generations) {
            res.json(generations);
        });
    });
});

// application -------------------------------------------------------------
app.get('*', function(req, res) {
  res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});
