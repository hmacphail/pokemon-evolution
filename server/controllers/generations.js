Generation = require('../models').Generation;
//Abilityset = require('../models').Abilityset;

module.exports = {
  //Get a list of all generations using model.findAll()
  index(req, res) {
    Generation.findAll({
        //include: Abilityset
      })
      .then((generations) => {
        res.status(200).json(generations);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Get a generation by the unique ID using model.findById()
  show(req, res) {
    Generation.findById(req.params.id)
      .then((generation) => {
        res.status(200).json(generation);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Create a new generation using model.create()
  create(req, res) {
    Generation.create(req.body)
      .then((newGeneration) => {
        res.status(200).json(newGeneration);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Delete an existing generation by the unique ID using model.destroy()
  delete(req, res) {
    Generation.destroy({
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
