// load the models
var db = require(__dirname + '/../../config/database');

// api ======================================================================
module.exports = function(app) {

  // generations ---------------------------------------------------------------------

  app.get('/api/generations', function(req, res) {

    // use sequelize to get all generations in the database
    db.Generation.findAll().then(function(generations) {
      res.json(generations); // return all generations in JSON format
    });
  });

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

};