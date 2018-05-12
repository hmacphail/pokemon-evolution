"use strict";

/*
 * Add data to generations table
 */
module.exports = {
  up: function (queryInterface, Sequelize) {
    let generations = [
      { id: 1, name: "I" }, { id: 2, name: "II" }, { id: 3, name: "III" }, { id: 4, name: "IV" },
      { id: 5, name: "V" }, { id: 6, name: "VI" }, { id: 7, name: "VII" }
    ];

    return queryInterface.bulkInsert("generations", generations);
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete("generations", true, { truncate: true });
  }
};
