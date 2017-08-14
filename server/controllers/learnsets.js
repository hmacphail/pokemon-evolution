Learnset = require('../models').Learnset;
Pokemon = require('../models').Pokemon;

module.exports = {
  //Get a list of all learnsets using model.findAll()
  index(req, res) {
    Learnset.findAll({
      //include: Pokemon
    })
      .then(function (learnsets) {
        res.status(200).json(learnsets);
      })
      .catch(function (error) {
        res.status(500).json(error);
      });
  },

  //Get a learnset by it's unique ID using model.findById()
  show(req, res) {
    Learnset.findById(req.params.id)
    .then(function (learnset) {
      res.status(200).json(learnset);
    })
    .catch(function (error){
      res.status(500).json(error);
    });
  },

  //Create a new learnset using model.create()
  create(req, res) {
    Learnset.create(req.body)
      .then(function (newLearnset) {
        res.status(200).json(newLearnset);
      })
      .catch(function (error){
        res.status(500).json(error);
      });
  },

  //Create multiple new learnsets using model.bulkCreate()
  bulkCreate(req, res) {
    Learnset.bulkCreate(req.body)
      .then(function(learnsets) {
        res.status(200).json(learnsets);
      })
      .catch(function (error) {
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
    .then(function (updatedRecords) {
      res.status(200).json(updatedRecords);
    })
    .catch(function (error){
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
    .then(function (deletedRecords) {
      res.status(200).json(deletedRecords);
    })
    .catch(function (error){
      res.status(500).json(error);
    });
  }
};
