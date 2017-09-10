Learnset = require('../models').Learnset;
Pokemon = require('../models').Pokemon;

module.exports = {
  //Get a list of all learnsets using model.findAll()
  index(req, res) {
    Learnset.findAll({
        //include: Pokemon
      })
      .then((learnsets) => {
        res.status(200).json(learnsets);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Get a learnset by it's unique ID using model.findById()
  show(req, res) {
    Learnset.findById(req.params.id)
      .then((learnset) => {
        res.status(200).json(learnset);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Create a new learnset using model.create()
  create(req, res) {
    Learnset.create(req.body)
      .then((newLearnset) => {
        res.status(200).json(newLearnset);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Create multiple new learnsets using model.bulkCreate()
  bulkCreate(req, res) {
    Learnset.bulkCreate(req.body)
      .then((learnsets) => {
        res.status(200).json(learnsets);
      })
      .catch((error) => {
        res.status(500).json(error);
        console.log(req.body[0].pokemonId);
      });
  },

  //Edit an existing learnset's details using model.update()
  update(req, res) {
    Learnset.update(req.body, {
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

  //Delete an existing learnset by the unique ID using model.destroy()
  delete(req, res) {
    Learnset.destroy({
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
