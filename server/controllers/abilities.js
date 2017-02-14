Ability = require('../models/').Ability;

module.exports = {
  //Get a list of all abilities using model.findAll()
  index(req, res) {
    Ability.findAll()
      .then(function (abilities) {
        res.status(200).json(abilities);
      })
      .catch(function (error) {
        res.status(500).json(error);
      });
  },

  //Get a ability by it's unique ID using model.findById()
  show(req, res) {
    Ability.findById(req.params.id)
    .then(function (ability) {
      res.status(200).json(ability);
    })
    .catch(function (error){
      res.status(500).json(error);
    });
  },

  //Create a new ability using model.create()
  create(req, res) {
    Ability.create(req.body)
      .then(function (newAbility) {
        res.status(200).json(newAbility);
      })
      .catch(function (error){
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
    .then(function (deletedRecords) {
      res.status(200).json(deletedRecords);
    })
    .catch(function (error){
      res.status(500).json(error);
    });
  }
};
