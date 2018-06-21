let generations = require('./routes/generations');
let pokemon = require('./routes/pokemon');
let pokemonStats = require('./routes/pokemonStats');
let evolutions = require('./routes/evolutions');
let types = require('./routes/types');
let effectiveness = require('./routes/effectiveness');
let abilities = require('./routes/abilities');
let abilitysets = require('./routes/abilitysets');
let moves = require('./routes/moves');
let zMoves = require('./routes/zMoves');
let moveFlags = require('./routes/moveFlags');
let learnsets = require('./routes/learnsets');
let items = require('./routes/items');
let pokemonTypes = require('./routes/pokemonTypes');
let games = require('./routes/games');
let pokemonLearnsets = require('./routes/pokemonLearnsets');
let users = require('./routes/users');

var express = require('express');
var router = express();

router.get('/generations', generations.list);
router.get('/generations/:id', generations.show);
router.post('/generations', generations.create);
router.delete('/generations/:id', generations.delete);

router.get('/pokemon', pokemon.list);
router.get('/pokemon/:id', pokemon.show);
router.post('/pokemon', pokemon.create);
router.post('/pokemon/bulk', pokemon.bulkCreate);
router.delete('/pokemon/:id', pokemon.delete);

router.get('/pokemon-stats', pokemonStats.list);
router.get('/pokemon-stats/:id', pokemonStats.show);
router.post('/pokemon-stats', pokemonStats.create);
router.post('/pokemon-stats/bulk', pokemonStats.bulkCreate);
router.delete('/pokemon-stats/:id', pokemonStats.delete);

router.get('/evolutions', evolutions.list);
router.get('/evolutions/:id', evolutions.show);
router.post('/evolutions', evolutions.create);
router.post('/evolutions/bulk', evolutions.bulkCreate);
router.delete('/evolutions/:id', evolutions.delete);

router.get('/types', types.list);
router.get('/types/:id', types.show);
router.post('/types', types.create);
router.delete('/types/:id', types.delete);

router.get('/effectiveness', effectiveness.list);
router.get('/effectiveness/:id', effectiveness.show);
router.post('/effectiveness', effectiveness.create);
router.post('/effectiveness/bulk', effectiveness.bulkCreate);
router.put('/effectiveness/:id', effectiveness.update);
router.delete('/effectiveness/:id', effectiveness.delete);

router.get('/abilities', abilities.list);
router.get('/abilities/:id', abilities.show);
router.post('/abilities', abilities.create);
router.post('/abilities/bulk', abilities.bulkCreate);
router.delete('/abilities/:id', abilities.delete);

router.get('/abilitysets', abilitysets.list);
router.get('/abilitysets/:id', abilitysets.show);
router.post('/abilitysets', abilitysets.create);
router.post('/abilitysets/bulk', abilitysets.bulkCreate);
router.delete('/abilitysets/:id', abilitysets.delete);

router.get('/moves', moves.list);
router.get('/moves/:id', moves.show);
router.post('/moves', moves.create);
router.post('/moves/bulk', moves.bulkCreate);
router.delete('/moves/:id', moves.delete);

router.get('/move-flags', moveFlags.list);
router.get('/move-flags/:id', moveFlags.show);
router.post('/move-flags', moveFlags.create);
router.post('/move-flags/bulk', moveFlags.bulkCreate);
router.delete('/move-flags/:id', moveFlags.delete);

router.get('/z-moves', zMoves.list);
router.get('/z-moves/:id', zMoves.show);
router.post('/z-moves', zMoves.create);
router.post('/z-moves/bulk', zMoves.bulkCreate);
router.delete('/z-moves/:id', zMoves.delete);

router.get('/learnsets', learnsets.list);
router.get('/learnsets/:id', learnsets.show);
router.post('/learnsets', learnsets.create);
router.post('/learnsets/bulk', learnsets.bulkCreate);
router.put('/learnsets/:id', learnsets.update);
router.delete('/learnsets/:id', learnsets.delete);

router.get('/pokemon-types', pokemonTypes.list);
router.get('/pokemon-types/:id', pokemonTypes.show);
router.post('/pokemon-types', pokemonTypes.create);
router.post('/pokemon-types/bulk', pokemonTypes.bulkCreate);
router.delete('/pokemon-types/:id', pokemonTypes.delete);

router.get('/items', items.list);
router.get('/items/:id', items.show);
router.post('/items', items.create);
router.post('/items/bulk', items.bulkCreate);
router.delete('/items/:id', items.delete);

router.get('/games', games.list);
router.get('/games/:id', games.show);
router.post('/games', games.create);
router.delete('/games/:id', games.delete);

router.get('/pokemon-learnsets', pokemonLearnsets.list);
router.get('/pokemon-learnsets/:id', pokemonLearnsets.show);
router.post('/pokemon-learnsets', pokemonLearnsets.create);
router.post('/pokemon-learnsets/bulk', pokemonLearnsets.bulkCreate);
router.put('/pokemon-learnsets/:id', pokemonLearnsets.update);
router.delete('/pokemon-learnsets/:id', pokemonLearnsets.delete);

router.get('/users', users.list);
router.get('/users/:id', users.show);
router.post('/users', users.create);
router.put('/users/:id', users.update);
router.delete('/users/:id', users.delete);

module.exports = router;
