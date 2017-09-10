Game = require('../models').Game;

module.exports = {
  //Get a list of all games using model.findAll()
  index(req, res) {
    Game.findAll()
      .then((games) => {
        res.status(200).json(games);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Get a game by it's unique ID using model.findById()
  show(req, res) {
    Game.findById(req.params.id)
      .then((game) => {
        res.status(200).json(game);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Create a new game using model.create()
  create(req, res) {
    Game.create(req.body)
      .then((newGame) => {
        res.status(200).json(newGame);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Delete an existing game by the unique ID using model.destroy()
  delete(req, res) {
    Game.destroy({
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
