var PokemonStat = require('../models').PokemonStats;

module.exports = {
  //Get a list of all pokemonStats using model.findAll()
  index(req, res) {
    PokemonStat.findAll()
      .then((pokemonStats) => {
        res.status(200).json(pokemonStats);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Get a pokemonStat by it's unique ID using model.findById()
  show(req, res) {
    PokemonStat.findById(req.params.id)
      .then((pokemonStat) => {
        res.status(200).json(pokemonStat);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Create a new pokemonStat using model.create()
  create(req, res) {
    PokemonStat.create(req.body)
      .then((newPokemonStat) => {
        res.status(200).json(newPokemonStat);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Create multiple new pokemonStats using model.bulkCreate()
  bulkCreate(req, res) {
    PokemonStat.bulkCreate(req.body)
      .then((pokemonStat) => {
        res.status(200).json(pokemonStat);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Delete an existing pokemonStat by the unique ID using model.destroy()
  delete(req, res) {
    PokemonStat.destroy({
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
