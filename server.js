// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
var pg = require('pg');                    // postgres db connection
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// configuration =================

//pg.defaults.ssl = true;
var host = 'ec2-54-83-194-208.compute-1.amazonaws.com';
var database = 'd8dvbdrannbitc';
var user = 'cganvxfjtvuhcn';
var port = 5432;

var config = {
  host: host,
  port: port,
  database: database,
  user: user,
  password: '6924217d33a6155b7efcd96c287668377e1da08bf29148f593f1f4ef2644de8c',
  ssl: true
};
console.log(process.env.DATABASE_URL);
pg.connect(config, function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');

  client
    .query('SELECT table_schema,table_name FROM information_schema.tables;')
    .on('row', function(row) {
      console.log(JSON.stringify(row));
    });
});

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");



// index.js
/*
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.get('/', function (request, response) {
  response.send('Hello world')
});

app.listen(app.get('port'), function () {
  console.log('Example app listening on port', app.get('port'));
});
*/