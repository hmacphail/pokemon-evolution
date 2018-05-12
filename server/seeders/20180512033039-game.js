"use strict";

/*
 * Add data to games table
 */
module.exports = {
  up: function (queryInterface, Sequelize) {
    let games = [
      { code: "RGB", description: "Pokémon Red, Green, and Blue", generationId: 1 },
      { code: "Y", description: "Pokémon Yellow", generationId: 1 },
      { code: "GS", description: "Pokémon Gold and Silver", generationId: 2 },
      { code: "C", description: "Pokémon Crystal", generationId: 2 },
      { code: "RS", description: "Pokémon Ruby and Sapphire", generationId: 3 },
      { code: "E", description: "Pokémon Emerald", generationId: 3 },
      { code: "FRLG", description: "Pokémon FireRed and LeafGreen", generationId: 3 },
      { code: "DP", description: "Pokémon Diamond and Pearl", generationId: 4 },
      { code: "Pt", description: "Pokémon Platinum", generationId: 4 },
      { code: "HGSS", description: "Pokémon HeartGold and SoulSilver", generationId: 4 },
      { code: "BW", description: "Pokémon Black and White", generationId: 5 },
      { code: "B2W2", description: "Pokémon Black 2 and White 2", generationId: 5 },
      { code: "XY", description: "Pokémon X and Y", generationId: 6 },
      { code: "ORAS", description: "Pokémon Omega Ruby and Alpha Sapphire", generationId: 6 },
      { code: "SM", description: "Pokémon Sun and Moon", generationId: 7 },
      { code: "USUM", description: "Pokémon Ultra Sun and Ultra Moon", generationId: 7 }
    ];

    return queryInterface.bulkInsert("games", games);
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete("games", true, { truncate: true });
  }
};
