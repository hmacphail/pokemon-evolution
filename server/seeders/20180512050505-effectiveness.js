"use strict";
var effectiveness = require('./json/effectiveness');

/*
 * Add data to effectiveness table
 */
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert("effectiveness", effectiveness);
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete("effectiveness", true, { truncate: true });
  }
};
