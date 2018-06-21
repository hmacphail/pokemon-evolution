var PokemonLearnset = require('../models').PokemonLearnsets;

module.exports = {
  //Get a list of all pokemonLearnsets using model.findAll()
  list(req, res) {
    PokemonLearnset.findAll()
      .then((pokemonLearnsets) => {
        res.status(200).json(pokemonLearnsets);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Get a pokemonLearnset by it's unique ID using model.findById()
  show(req, res) {
    PokemonLearnset.findById(req.params.id)
      .then((pokemonLearnset) => {
        res.status(200).json(pokemonLearnset);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Create a new pokemonLearnset using model.create()
  create(req, res) {
    PokemonLearnset.create(req.body)
      .then((newPokemonLearnset) => {
        res.status(200).json(newPokemonLearnset);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Create multiple new pokemonLearnsets using model.bulkCreate()
  bulkCreate(req, res) {
    PokemonLearnset.bulkCreate(req.body)
      .then((pokemonLearnset) => {
        res.status(200).json(pokemonLearnset);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Edit an existing pokemonLearnset details using model.update()
  update(req, res) {
    PokemonLearnset.update(req.body, {
        where: {
          id: req.params.id
        }
      })
      .then((updatedRecords) => {
        res.status(200).json(updatedRecords);
      })
      .catch((error) => {
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
      .then((deletedRecords) => {
        res.status(200).json(deletedRecords);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },
};
