ZMove = require('../models').ZMove;

module.exports = {
  //Get a list of all zMove using model.findAll()
  index(req, res) {
    ZMove.findAll()
      .then((zMoves) => {
        res.status(200).json(zMoves);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Get a zMove by it's unique ID using model.findById()
  show(req, res) {
    ZMove.findById(req.params.id)
      .then((zMove) => {
        res.status(200).json(zMove);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Create a new zMove using model.create()
  create(req, res) {
    ZMove.create(req.body)
      .then((newZMoves) => {
        res.status(200).json(newZMoves);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Create multiple new zMoves using model.bulkCreate()
  bulkCreate(req, res) {
    ZMove.bulkCreate(req.body)
      .then((zMove) => {
        res.status(200).json(zMove);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Delete an existing zMove by the unique ID using model.destroy()
  delete(req, res) {
    ZMove.destroy({
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
