var Ability = require('../models').Ability;

module.exports = {
  //Get a list of all abilities using model.findAll()
  list(req, res) {
    Ability.findAll()
      .then((abilities) => {
        res.status(200).json(abilities);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Get a ability by it's unique ID using model.findById()
  show(req, res) {
    Ability.findById(req.params.id)
      .then((ability) => {
        res.status(200).json(ability);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Create a new ability using model.create()
  create(req, res) {
    Ability.create(req.body)
      .then((newAbility) => {
        res.status(200).json(newAbility);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Create multiple new abilities using model.bulkCreate()
  bulkCreate(req, res) {
    Ability.bulkCreate(req.body)
      .then((abilities) => {
        res.status(200).json(abilities);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Delete an existing ability by the unique ID using model.destroy()
  delete(req, res) {
    Ability.destroy({
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
