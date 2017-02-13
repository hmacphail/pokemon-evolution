Skill = require('../models/').Skill;

module.exports = {
  //Get a list of all skills using model.findAll()
  index(req, res) {
    Skill.findAll()
      .then(function (skills) {
        res.status(200).json(skills);
      })
      .catch(function (error) {
        res.status(500).json(error);
      });
  },

  //Get a skill by it's unique ID using model.findById()
  show(req, res) {
    Skill.findById(req.params.id)
    .then(function (skill) {
      res.status(200).json(skill);
    })
    .catch(function (error){
      res.status(500).json(error);
    });
  },

  //Create a new skill using model.create()
  create(req, res) {
    Skill.create(req.body)
      .then(function (newSkill) {
        res.status(200).json(newSkill);
      })
      .catch(function (error){
        res.status(500).json(error);
      });
  },

  //Delete an existing skill by the unique ID using model.destroy()
  delete(req, res) {
    Skill.destroy({
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
