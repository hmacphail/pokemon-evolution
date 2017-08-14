PokemonType = require('../models').PokemonTypes;

module.exports = {
  //Get a list of all pokemonTypes using model.findAll()
  index(req, res) {
    PokemonType.findAll()
      .then(function (pokemonTypes) {
        res.status(200).json(pokemonTypes);
      })
      .catch(function (error) {
        res.status(500).json(error);
      });
  },

  //Get a pokemonType by it's unique ID using model.findById()
  show(req, res) {
    PokemonType.findById(req.params.id)
    .then(function (pokemonType) {
      res.status(200).json(pokemonType);
    })
    .catch(function (error){
      res.status(500).json(error);
    });
  },

  //Create a new pokemonType using model.create()
  create(req, res) {
    PokemonType.create(req.body)
      .then(function (newPokemonType) {
        res.status(200).json(newPokemonType);
      })
      .catch(function (error){
        res.status(500).json(error);
      });
  },

  //Create multiple new pokemonTypes using model.bulkCreate()
  bulkCreate(req, res) {
    PokemonType.bulkCreate(req.body)
      .then(function(pokemonType) {
        res.status(200).json(pokemonType);
      })
      .catch(function (error) {
        res.status(500).json(error);
      });
  },

  //Delete an existing pokemonType by the unique ID using model.destroy()
  delete(req, res) {
    PokemonType.destroy({
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
