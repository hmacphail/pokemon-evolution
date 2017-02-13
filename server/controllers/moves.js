Move = require('../models/').Move;

module.exports = {
  //Get a list of all moves using model.findAll()
  index(req, res) {
    Move.findAll()
      .then(function (moves) {
        res.status(200).json(moves);
      })
      .catch(function (error) {
        res.status(500).json(error);
      });
  },

  //Get a move by it's unique ID using model.findById()
  show(req, res) {
    Move.findById(req.params.id)
    .then(function (move) {
      res.status(200).json(move);
    })
    .catch(function (error){
      res.status(500).json(error);
    });
  },

  //Create a new move using model.create()
  create(req, res) {
    Move.create(req.body)
      .then(function (newMove) {
        res.status(200).json(newMove);
      })
      .catch(function (error){
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
    .then(function (deletedRecords) {
      res.status(200).json(deletedRecords);
    })
    .catch(function (error){
      res.status(500).json(error);
    });
  }
};
