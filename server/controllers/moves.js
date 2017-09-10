Move = require('../models').Move;

module.exports = {
  //Get a list of all moves using model.findAll()
  index(req, res) {
    Move.findAll()
      .then((moves) => {
        res.status(200).json(moves);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Get a move by it's unique ID using model.findById()
  show(req, res) {
    Move.findById(req.params.id)
      .then((move) => {
        res.status(200).json(move);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Create a new move using model.create()
  create(req, res) {
    Move.create(req.body)
      .then((newMove) => {
        res.status(200).json(newMove);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Create multiple new moves using model.bulkCreate()
  bulkCreate(req, res) {
    Move.bulkCreate(req.body)
      .then((moves) => {
        res.status(200).json(moves);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Delete an existing move by the unique ID using model.destroy()
  delete(req, res) {
    Move.destroy({
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
