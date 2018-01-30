MoveFlag = require('../models').MoveFlags;

module.exports = {
  //Get a list of all moveFlags using model.findAll()
  index(req, res) {
    MoveFlag.findAll()
      .then((moveFlags) => {
        res.status(200).json(moveFlags);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Get a moveFlag by it's unique ID using model.findById()
  show(req, res) {
    MoveFlag.findById(req.params.id)
      .then((moveFlag) => {
        res.status(200).json(moveFlag);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Create a new moveFlag using model.create()
  create(req, res) {
    MoveFlag.create(req.body)
      .then((newMoveFlag) => {
        res.status(200).json(newMoveFlag);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Create multiple new moveFlags using model.bulkCreate()
  bulkCreate(req, res) {
    MoveFlag.bulkCreate(req.body)
      .then((moveFlag) => {
        res.status(200).json(moveFlag);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Delete an existing moveFlag by the unique ID using model.destroy()
  delete(req, res) {
    MoveFlag.destroy({
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
