"use strict";
var items = require('./json/item');

/*
 * Add data to items table
 */
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert("items", items);
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete("items", true, { truncate: true });
  }
};
