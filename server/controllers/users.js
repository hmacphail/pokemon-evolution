User = require('../models').User;

module.exports = {
  //Get a list of all users using model.findAll()
  index(req, res) {
    User.findAll()
      .then((users) => {
        res.status(200).json(users);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Get a user by the unique ID using model.findById()
  show(req, res) {
    User.findById(req.params.id)
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Create a new user using model.create()
  create(req, res) {
    User.create(req.body)
      .then((newUser) => {
        res.status(200).json(newUser);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  //Edit an existing user details using model.update()
  update(req, res) {
    User.update(req.body, {
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

  //Delete an existing user by the unique ID using model.destroy()
  delete(req, res) {
    User.destroy({
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
