Item = require('../models/').Item;

module.exports = {
  //Get a list of all items using model.findAll()
  index(req, res) {
    Item.findAll()
      .then(function (items) {
        res.status(200).json(items);
      })
      .catch(function (error) {
        res.status(500).json(error);
      });
  },

  //Get a item by it's unique ID using model.findById()
  show(req, res) {
    Item.findById(req.params.id)
    .then(function (item) {
      res.status(200).json(item);
    })
    .catch(function (error){
      res.status(500).json(error);
    });
  },

  //Create a new item using model.create()
  create(req, res) {
    Item.create(req.body)
      .then(function (newItem) {
        res.status(200).json(newItem);
      })
      .catch(function (error){
        res.status(500).json(error);
      });
  },

  //Create multiple new items using model.bulkCreate()
  bulkCreate(req, res) {
    Item.bulkCreate(req.body)
      .then(function() {
        return Item.findAll();
      })
      .then(function(item) {
        res.status(200).json(item)
      })
      .catch(function (error) {
        res.status(500).json(error);
      });
  },

  //Delete an existing item by the unique ID using model.destroy()
  delete(req, res) {
    Item.destroy({
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
