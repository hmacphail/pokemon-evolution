Generation = require('../models/').Generation;
Skillset = require('../models/').Skillset;

module.exports = {
  //Get a list of all generations using model.findAll()
  index(req, res) {
    Generation.findAll({
      //include: Skillset
    })
      .then(function (generations) {
        res.status(200).json(generations);
      })
      .catch(function (error) {
        res.status(500).json(error);
      });
  },

  //Get a generation by the unique ID using model.findById()
  show(req, res) {
    Generation.findById(req.params.id, {
      //include: Skillset
    })
    .then(function (generation) {
      res.status(200).json(generation);
    })
    .catch(function (error){
      res.status(500).json(error);
    });
  },

  //Create a new generation using model.create()
  create(req, res) {
    Generation.create(req.body)
      .then(function (newGeneration) {
        res.status(200).json(newGeneration);
      })
      .catch(function (error){
        res.status(500).json(error);
      });
  },

  //Edit an existing generation details using model.update()
  update(req, res) {
    Generation.update(req.body, {
      where: {
        id: req.params.id
      }
    })
    .then(function (updatedRecords) {
      res.status(200).json(updatedRecords);
    })
    .catch(function (error){
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
    .then(function (deletedRecords) {
      res.status(200).json(deletedRecords);
    })
    .catch(function (error){
      res.status(500).json(error);
    });
  }
};
