"use strict";
var pokemon = require('./json/pokemon');

/*
 * Add data to pokemon table
 */
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert("pokemon", pokemon);
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete("pokemon", true, { truncate: true });
  }
};
