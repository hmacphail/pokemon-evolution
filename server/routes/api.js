var express = require('express');
var router = express();
//var db = require(global.rootdir + '/server/models');
var generations = require(global.rootdir + '/server/controllers/generations');
var skillsets = require(global.rootdir + '/server/controllers/skillsets');

router.get('/generations', generations.index);
router.get('/generations/:id', generations.show);
router.post('/generations', generations.create);
router.put('/generations', generations.update);
router.delete('/generations', generations.delete);

router.get('/skillsets', skillsets.index);
router.get('/skillsets/:id', skillsets.show);
router.post('/skillsets', skillsets.create);
router.delete('/skillsets', skillsets.delete);

// api ======================================================================

// generations ---------------------------------------------------------------------

module.exports = router;
