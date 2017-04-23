Pokemon = require('../models/').Pokemon;

module.exports = {
  //Get a list of all pokemons using model.findAll()
  index(req, res) {
    Pokemon.findAll()
      .then(function (pokemons) {
        res.status(200).json(pokemons);
      })
      .catch(function (error) {
        res.status(500).json(error);
      });
  },

  //Get a pokemon by it's unique ID using model.findById()
  show(req, res) {
    Pokemon.findById(req.params.id)
    .then(function (pokemon) {
      res.status(200).json(pokemon);
    })
    .catch(function (error){
      res.status(500).json(error);
    });
  },

  //Create a new pokemon using model.create()
  create(req, res) {
    Pokemon.create(req.body)
      .then(function (newPokemon) {
        res.status(200).json(newPokemon);
      })
      .catch(function (error){
        res.status(500).json(error);
      });
  },

  //Create multiple new pokemon using model.bulkCreate()
  bulkCreate(req, res) {
    Pokemon.bulkCreate(req.body)
      .then(function(pokemon) {
        res.status(200).json(pokemon);
      })
      .catch(function (error) {
        res.status(500).json(error);
      });
  },

  //Delete an existing pokemon by the unique ID using model.destroy()
  delete(req, res) {
    Pokemon.destroy({
      where: {
        id: req.params.id
      }
    })
    .then(function (deletedRecords) {
      res.status(200).json(deletedRecords);
    })
    .catch(function (error){
      res.status(500).json(error);
    });
  }
};
