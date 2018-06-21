var Pokemon = require('../models').Pokemon;

module.exports = {
  //Get a list of all pokemons using model.findAll()
  index(req, res) {
    Pokemon.findAll()
      .then((pokemons) => {
        res.status(200).json(pokemons);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Get a pokemon by it's unique ID using model.findById()
  show(req, res) {
    Pokemon.findById(req.params.id)
      .then((pokemon) => {
        res.status(200).json(pokemon);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Create a new pokemon using model.create()
  create(req, res) {
    Pokemon.create(req.body)
      .then((newPokemon) => {
        res.status(200).json(newPokemon);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Create multiple new pokemon using model.bulkCreate()
  bulkCreate(req, res) {
    Pokemon.bulkCreate(req.body)
      .then((pokemon) => {
        res.status(200).json(pokemon);
      })
      .catch((error) => {
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
      .then((deletedRecords) => {
        res.status(200).json(deletedRecords);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },
};
