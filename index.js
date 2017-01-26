// index.js

var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.get('/', function (request, response) {
  response.send('Hello world')
});

app.listen(app.get('port'), function () {
  console.log('Example app listening on port', app.get('port'));
});
