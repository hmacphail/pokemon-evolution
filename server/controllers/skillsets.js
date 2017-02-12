Skillset = require('../models/').Skillset;

module.exports = {
  //Get a list of all skillsets using model.findAll()
  index(req, res) {
    Skillset.findAll()
      .then(function (skillsets) {
        res.status(200).json(skillsets);
      })
      .catch(function (error) {
        res.status(500).json(error);
      });
  },

  //Get a skillset by it's unique ID using model.findById()
  show(req, res) {
    Skillset.findById(req.params.id)
    .then(function (skillset) {
      res.status(200).json(skillset);
    })
    .catch(function (error){
      res.status(500).json(error);
    });
  },

  //Create a new skillset using model.create()
  create(req, res) {
    Skillset.create(req.body)
      .then(function (newSkillset) {
        res.status(200).json(newSkillset);
      })
      .catch(function (error){
        res.status(500).json(error);
      });
  },

  //Delete an existing skillset by the unique ID using model.destroy()
  delete(req, res) {
    Skillset.destroy({
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
