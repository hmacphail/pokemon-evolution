var express = require('express');
var router = express();

var generations = require(global.rootdir + '/server/controllers/generations');
var pokemon = require(global.rootdir + '/server/controllers/pokemon');
var evolutions = require(global.rootdir + '/server/controllers/evolutions');
var types = require(global.rootdir + '/server/controllers/types');
var effectiveness = require(global.rootdir + '/server/controllers/effectiveness');
var skills = require(global.rootdir + '/server/controllers/skills');
var skillsets = require(global.rootdir + '/server/controllers/skillsets');
var moves = require(global.rootdir + '/server/controllers/moves');
var learnsets = require(global.rootdir + '/server/controllers/learnsets');
var items = require(global.rootdir + '/server/controllers/items');
var users = require(global.rootdir + '/server/controllers/users');

router.get('/generations', generations.index);
router.get('/generations/:id', generations.show);
router.post('/generations', generations.create);
router.delete('/generations/:id', generations.delete);

router.get('/pokemon', pokemon.index);
router.get('/pokemon/:id', pokemon.show);
router.post('/pokemon', pokemon.create);
router.delete('/pokemon', pokemon.delete);

router.get('/evolutions', evolutions.index);
router.get('/evolutions/:id', evolutions.show);
router.post('/evolutions', evolutions.create);
router.delete('/evolutions', evolutions.delete);

router.get('/types', types.index);
router.get('/types/:id', types.show);
router.post('/types', types.create);
router.delete('/types', types.delete);

router.get('/effectiveness', effectiveness.index);
router.get('/effectiveness/:id', effectiveness.show);
router.post('/effectiveness', effectiveness.create);
router.delete('/effectiveness', effectiveness.delete);

router.get('/skills', skills.index);
router.get('/skills/:id', skills.show);
router.post('/skills', skills.create);
router.delete('/skills', skills.delete);

router.get('/skillsets', skillsets.index);
router.get('/skillsets/:id', skillsets.show);
router.post('/skillsets', skillsets.create);
router.delete('/skillsets', skillsets.delete);

router.get('/moves', moves.index);
router.get('/moves/:id', moves.show);
router.post('/moves', moves.create);
router.delete('/moves', moves.delete);

router.get('/learnsets', learnsets.index);
router.get('/learnsets/:id', learnsets.show);
router.post('/learnsets', learnsets.create);
router.delete('/learnsets', learnsets.delete);

router.get('/items', items.index);
router.get('/items/:id', items.show);
router.post('/items', items.create);
router.delete('/items', items.delete);

router.get('/users', users.index);
router.get('/users/:id', users.show);
router.post('/users', users.create);
router.put('/users/:id', users.update);
router.delete('/users/:id', users.delete);

module.exports = router;
