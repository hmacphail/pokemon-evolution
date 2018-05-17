generations       = require('./controllers/generations');
pokemon           = require('./controllers/pokemon');
pokemonStats	  = require('./controllers/pokemonStats');
evolutions        = require('./controllers/evolutions');
types             = require('./controllers/types');
effectiveness     = require('./controllers/effectiveness');
abilities         = require('./controllers/abilities');
abilitysets       = require('./controllers/abilitysets');
moves             = require('./controllers/moves');
zMoves			  = require('./controllers/zMoves');
moveFlags		  = require('./controllers/moveFlags');
learnsets         = require('./controllers/learnsets');
items             = require('./controllers/items');
pokemonTypes      = require('./controllers/pokemonTypes');
games             = require('./controllers/games');
pokemonLearnsets  = require('./controllers/pokemonLearnsets');
users             = require('./controllers/users');

express = require('express');
var router = express();

router.get(   '/generations',           generations.index);
router.get(   '/generations/:id',       generations.show);
router.post(  '/generations',           generations.create);
router.delete('/generations/:id',       generations.delete);

router.get(   '/pokemon',               pokemon.index);
router.get(   '/pokemon/:id',           pokemon.show);
router.post(  '/pokemon',               pokemon.create);
router.post(  '/pokemon/bulk',          pokemon.bulkCreate);
router.delete('/pokemon/:id',           pokemon.delete);

router.get(   '/pokemon-stats',         pokemonStats.index);
router.get(   '/pokemon-stats/:id',     pokemonStats.show);
router.post(  '/pokemon-stats',         pokemonStats.create);
router.post(  '/pokemon-stats/bulk',    pokemonStats.bulkCreate);
router.delete('/pokemon-stats/:id',     pokemonStats.delete);

router.get(   '/evolutions',            evolutions.index);
router.get(   '/evolutions/:id',        evolutions.show);
router.post(  '/evolutions',            evolutions.create);
router.post(  '/evolutions/bulk',       evolutions.bulkCreate);
router.delete('/evolutions/:id',        evolutions.delete);

router.get(   '/types',                 types.index);
router.get(   '/types/:id',             types.show);
router.post(  '/types',                 types.create);
router.delete('/types/:id',             types.delete);

router.get(   '/effectiveness',         effectiveness.index);
router.get(   '/effectiveness/:id',     effectiveness.show);
router.post(  '/effectiveness',         effectiveness.create);
router.post(  '/effectiveness/bulk',    effectiveness.bulkCreate);
router.put(   '/effectiveness/:id',     effectiveness.update);
router.delete('/effectiveness/:id',     effectiveness.delete);

router.get(   '/abilities',             abilities.index);
router.get(   '/abilities/:id',         abilities.show);
router.post(  '/abilities',             abilities.create);
router.post(  '/abilities/bulk',        abilities.bulkCreate);
router.delete('/abilities/:id',         abilities.delete);

router.get(   '/abilitysets',           abilitysets.index);
router.get(   '/abilitysets/:id',       abilitysets.show);
router.post(  '/abilitysets',           abilitysets.create);
router.post(  '/abilitysets/bulk',      abilitysets.bulkCreate);
router.delete('/abilitysets/:id',       abilitysets.delete);

router.get(   '/moves',                 moves.index);
router.get(   '/moves/:id',             moves.show);
router.post(  '/moves',                 moves.create);
router.post(  '/moves/bulk',            moves.bulkCreate);
router.delete('/moves/:id',             moves.delete);

router.get(   '/move-flags',            moveFlags.index);
router.get(   '/move-flags/:id',        moveFlags.show);
router.post(  '/move-flags',            moveFlags.create);
router.post(  '/move-flags/bulk',       moveFlags.bulkCreate);
router.delete('/move-flags/:id',        moveFlags.delete);

router.get(   '/z-moves',               zMoves.index);
router.get(   '/z-moves/:id',           zMoves.show);
router.post(  '/z-moves',               zMoves.create);
router.post(  '/z-moves/bulk',          zMoves.bulkCreate);
router.delete('/z-moves/:id',           zMoves.delete);

router.get(   '/learnsets',             learnsets.index);
router.get(   '/learnsets/:id',         learnsets.show);
router.post(  '/learnsets',             learnsets.create);
router.post(  '/learnsets/bulk',        learnsets.bulkCreate);
router.put(   '/learnsets/:id',         learnsets.update);
router.delete('/learnsets/:id',         learnsets.delete);

router.get(   '/pokemon-types',         pokemonTypes.index);
router.get(   '/pokemon-types/:id',     pokemonTypes.show);
router.post(  '/pokemon-types',         pokemonTypes.create);
router.post(  '/pokemon-types/bulk',    pokemonTypes.bulkCreate);
router.delete('/pokemon-types/:id',     pokemonTypes.delete);

router.get(   '/items',                 items.index);
router.get(   '/items/:id',             items.show);
router.post(  '/items',                 items.create);
router.post(  '/items/bulk',            items.bulkCreate);
router.delete('/items/:id',             items.delete);

router.get(   '/games',                 games.index);
router.get(   '/games/:id',             games.show);
router.post(  '/games',                 games.create);
router.delete('/games/:id',             games.delete);

router.get(   '/pokemon-learnsets',     pokemonLearnsets.index);
router.get(   '/pokemon-learnsets/:id', pokemonLearnsets.show);
router.post(  '/pokemon-learnsets',     pokemonLearnsets.create);
router.post(  '/pokemon-learnsets/bulk',pokemonLearnsets.bulkCreate);
router.put(   '/pokemon-learnsets/:id', pokemonLearnsets.update);
router.delete('/pokemon-learnsets/:id', pokemonLearnsets.delete);

router.get(   '/users',                 users.index);
router.get(   '/users/:id',             users.show);
router.post(  '/users',                 users.create);
router.put(   '/users/:id',             users.update);
router.delete('/users/:id',             users.delete);

module.exports = router;
