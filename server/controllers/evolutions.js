Evolution = require('../models/').Evolution;

module.exports = {
  //Get a list of all evolutions using model.findAll()
  index(req, res) {
    Evolution.findAll()
      .then(function (evolutions) {
        res.status(200).json(evolutions);
      })
      .catch(function (error) {
        res.status(500).json(error);
      });
  },

  //Get a evolution by it's unique ID using model.findById()
  show(req, res) {
    Evolution.findById(req.params.id)
    .then(function (evolution) {
      res.status(200).json(evolution);
    })
    .catch(function (error){
      res.status(500).json(error);
    });
  },

  //Create a new evolution using model.create()
  create(req, res) {
    Evolution.create(req.body)
      .then(function (newEvolution) {
        res.status(200).json(newEvolution);
      })
      .catch(function (error){
        res.status(500).json(error);
      });
  },

  //Create multiple new evolutions using model.bulkCreate()
  bulkCreate(req, res) {
    Evolution.bulkCreate(req.body)
      .then(function() {
        return Evolution.findAll();
      })
      .then(function(evolution) {
        res.status(200).json(evolution)
      })
      .catch(function (error) {
        res.status(500).json(error);
      });
  },

  //Delete an existing evolution by the unique ID using model.destroy()
  delete(req, res) {
    Evolution.destroy({
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
