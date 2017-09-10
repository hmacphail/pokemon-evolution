Effectiveness = require('../models').Effectiveness;

module.exports = {
  //Get a list of all effectivenesss using model.findAll()
  index(req, res) {
    Effectiveness.findAll()
      .then((effectivenesss) => {
        res.status(200).json(effectivenesss);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Get a effectiveness by it's unique ID using model.findById()
  show(req, res) {
    Effectiveness.findById(req.params.id)
      .then((effectiveness) => {
        res.status(200).json(effectiveness);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Create a new effectiveness using model.create()
  create(req, res) {
    Effectiveness.create(req.body)
      .then((newEffectiveness) => {
        res.status(200).json(newEffectiveness);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Create multiple new effectiveness using model.bulkCreate()
  bulkCreate(req, res) {
    Effectiveness.bulkCreate(req.body)
      .then((effectiveness) => {
        res.status(200).json(effectiveness);
      })
      .catch((error) => {
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
      .then((updatedRecords) => {
        res.status(200).json(updatedRecords);
      })
      .catch((error) => {
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
      .then((deletedRecords) => {
        res.status(200).json(deletedRecords);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },
};
