"use strict";
var abilities = require('./json/ability');

/*
 * Add data to abilities table
 */
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert("abilities", abilities);
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete("abilities", true, { truncate: true });
  }
};
