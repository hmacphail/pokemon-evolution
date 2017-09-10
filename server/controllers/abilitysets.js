Abilityset = require('../models').Abilityset;

module.exports = {
  //Get a list of all abilitysets using model.findAll()
  index(req, res) {
    Abilityset.findAll()
      .then((abilitysets) => {
        res.status(200).json(abilitysets);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Get a abilityset by it's unique ID using model.findById()
  show(req, res) {
    Abilityset.findById(req.params.id)
      .then((abilityset) => {
        res.status(200).json(abilityset);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Create a new abilityset using model.create()
  create(req, res) {
    Abilityset.create(req.body)
      .then((newAbilityset) => {
        res.status(200).json(newAbilityset);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Create multiple new abilitysets using model.bulkCreate()
  bulkCreate(req, res) {
    Abilityset.bulkCreate(req.body)
      .then((abilityset) => {
        res.status(200).json(abilityset);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Delete an existing abilityset by the unique ID using model.destroy()
  delete(req, res) {
    Abilityset.destroy({
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
