PokemonLearnset = require('../models').PokemonLearnsets;

module.exports = {
  //Get a list of all pokemonLearnsets using model.findAll()
  index(req, res) {
    PokemonLearnset.findAll()
      .then(function (pokemonLearnsets) {
        res.status(200).json(pokemonLearnsets);
      })
      .catch(function (error) {
        res.status(500).json(error);
      });
  },

  //Get a pokemonLearnset by it's unique ID using model.findById()
  show(req, res) {
    PokemonLearnset.findById(req.params.id)
    .then(function (pokemonLearnset) {
      res.status(200).json(pokemonLearnset);
    })
    .catch(function (error){
      res.status(500).json(error);
    });
  },

  //Create a new pokemonLearnset using model.create()
  create(req, res) {
    PokemonLearnset.create(req.body)
      .then(function (newPokemonLearnset) {
        res.status(200).json(newPokemonLearnset);
      })
      .catch(function (error){
        res.status(500).json(error);
      });
  },

  //Create multiple new pokemonLearnsets using model.bulkCreate()
  bulkCreate(req, res) {
    PokemonLearnset.bulkCreate(req.body)
      .then(function(pokemonLearnset) {
        res.status(200).json(pokemonLearnset);
      })
      .catch(function (error) {
        res.status(500).json(error);
      });
  },

  //Delete an existing pokemonLearnset by the unique ID using model.destroy()
  delete(req, res) {
    PokemonLearnset.destroy({
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
