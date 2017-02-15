Effectiveness = require('../models/').Effectiveness;

module.exports = {
  //Get a list of all effectivenesss using model.findAll()
  index(req, res) {
    Effectiveness.findAll()
      .then(function (effectivenesss) {
        res.status(200).json(effectivenesss);
      })
      .catch(function (error) {
        res.status(500).json(error);
      });
  },

  //Get a effectiveness by it's unique ID using model.findById()
  show(req, res) {
    Effectiveness.findById(req.params.id)
    .then(function (effectiveness) {
      res.status(200).json(effectiveness);
    })
    .catch(function (error){
      res.status(500).json(error);
    });
  },

  //Create a new effectiveness using model.create()
  create(req, res) {
    Effectiveness.create(req.body)
      .then(function (newEffectiveness) {
        res.status(200).json(newEffectiveness);
      })
      .catch(function (error){
        res.status(500).json(error);
      });
  },

  //Create multiple new effectiveness using model.bulkCreate()
  bulkCreate(req, res) {
    Effectiveness.bulkCreate(req.body)
      .then(function() {
        return Effectiveness.findAll();
      })
      .then(function(effectiveness) {
        res.status(200).json(effectiveness)
      })
      .catch(function (error) {
        res.status(500).json(error);
      });
  },

  //Edit an existing effectiveness details using model.update()
  update(req, res) {
    Effectiveness.update(req.body, {
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

  //Delete an existing effectiveness by the unique ID using model.destroy()
  delete(req, res) {
    Effectiveness.destroy({
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
