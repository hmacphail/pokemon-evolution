var express = require('express');
var router  = express();

var generations   = require('./controllers/generations');
var pokemon       = require('./controllers/pokemon');
var evolutions    = require('./controllers/evolutions');
var types         = require('./controllers/types');
var effectiveness = require('./controllers/effectiveness');
var abilities     = require('./controllers/abilities');
var abilitysets   = require('./controllers/abilitysets');
var moves         = require('./controllers/moves');
var learnsets     = require('./controllers/learnsets');
var items         = require('./controllers/items');
var users         = require('./controllers/users');

router.get(   '/generations',         generations.index);
router.get(   '/generations/:id',     generations.show);
router.post(  '/generations',         generations.create);
router.delete('/generations/:id',     generations.delete);

router.get(   '/pokemon',             pokemon.index);
router.get(   '/pokemon/:id',         pokemon.show);
router.post(  '/pokemon',             pokemon.create);
router.post(  '/pokemon/bulk',        pokemon.bulkCreate);
router.delete('/pokemon/:id',         pokemon.delete);

router.get(   '/evolutions',          evolutions.index);
router.get(   '/evolutions/:id',      evolutions.show);
router.post(  '/evolutions',          evolutions.create);
router.post(  '/evolutions/bulk',     evolutions.bulkCreate);
router.delete('/evolutions/:id',      evolutions.delete);

router.get(   '/types',               types.index);
router.get(   '/types/:id',           types.show);
router.post(  '/types',               types.create);
router.delete('/types/:id',           types.delete);

router.get(   '/effectiveness',       effectiveness.index);
router.get(   '/effectiveness/:id',   effectiveness.show);
router.post(  '/effectiveness',       effectiveness.create);
router.post(  '/effectiveness/bulk',  effectiveness.bulkCreate);
router.put(   '/effectiveness/:id',   effectiveness.update);
router.delete('/effectiveness/:id',   effectiveness.delete);

router.get(   '/abilities',           abilities.index);
router.get(   '/abilities/:id',       abilities.show);
router.post(  '/abilities',           abilities.create);
router.post(  '/abilities/bulk',      abilities.bulkCreate);
router.delete('/abilities/:id',       abilities.delete);

router.get(   '/abilitysets',         abilitysets.index);
router.get(   '/abilitysets/:id',     abilitysets.show);
router.post(  '/abilitysets',         abilitysets.create);
router.post(  '/abilitysets/bulk',    abilitysets.bulkCreate);
router.delete('/abilitysets/:id',     abilitysets.delete);

router.get(   '/moves',               moves.index);
router.get(   '/moves/:id',           moves.show);
router.post(  '/moves',               moves.create);
router.post(  '/moves/bulk',          moves.bulkCreate);
router.delete('/moves/:id',           moves.delete);

router.get(   '/learnsets',           learnsets.index);
router.get(   '/learnsets/:id',       learnsets.show);
router.post(  '/learnsets',           learnsets.create);
router.post(  '/learnsets/bulk',      learnsets.bulkCreate);
router.delete('/learnsets/:id',       learnsets.delete);

router.get(   '/items',               items.index);
router.get(   '/items/:id',           items.show);
router.post(  '/items',               items.create);
router.post(  '/items/bulk',          items.bulkCreate);
router.delete('/items/:id',           items.delete);

router.get(   '/users',               users.index);
router.get(   '/users/:id',           users.show);
router.post(  '/users',               users.create);
router.put(   '/users/:id',           users.update);
router.delete('/users/:id',           users.delete);

module.exports = router;
