var Type = require('../models').Type;

module.exports = {
  //Get a list of all types using model.findAll()
  list(req, res) {
    Type.findAll()
      .then((types) => {
        res.status(200).json(types);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Get a type by it's unique ID using model.findById()
  show(req, res) {
    Type.findById(req.params.id)
      .then((type) => {
        res.status(200).json(type);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Create a new type using model.create()
  create(req, res) {
    Type.create(req.body)
      .then((newType) => {
        res.status(200).json(newType);
      })
      .catch((error) => {
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
      .then((deletedRecords) => {
        res.status(200).json(deletedRecords);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },
};
