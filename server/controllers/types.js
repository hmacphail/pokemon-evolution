Type = require('../models/').Type;

module.exports = {
  //Get a list of all types using model.findAll()
  index(req, res) {
    Type.findAll()
      .then(function (types) {
        res.status(200).json(types);
      })
      .catch(function (error) {
        res.status(500).json(error);
      });
  },

  //Get a type by it's unique ID using model.findById()
  show(req, res) {
    Type.findById(req.params.id)
    .then(function (type) {
      res.status(200).json(type);
    })
    .catch(function (error){
      res.status(500).json(error);
    });
  },

  //Create a new type using model.create()
  create(req, res) {
    Type.create(req.body)
      .then(function (newType) {
        res.status(200).json(newType);
      })
      .catch(function (error){
        res.status(500).json(error);
      });
  },

  //Delete an existing type by the unique ID using model.destroy()
  delete(req, res) {
    Type.destroy({
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
