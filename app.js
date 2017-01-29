// set up ========================
var express = require('express');
var app = express();                               // create our app w/ express
var http = require('http');
var path = require('path');
var pg = require('pg');                    // postgres db connection
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var Sequelize = require('sequelize');
//var routes = require('./routes');
var db = require('./config/database');

console.log(path);

// configuration ========================
app.port = process.env.PORT || 5000;

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// routes ================================
require('./app/routes/api')(app);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/app/views/home.html'); // load the single view file (angular will handle the page changes on the front-end)
});

// start up server =======================
db.sequelize.sync().then(function() {
  http.createServer(app).listen(app.port, function(){
    console.log('Express server listening on port ' + app.port);
  });
});
