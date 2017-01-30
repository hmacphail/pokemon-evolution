var express = require('express');
var router = express.Router();
var rootdir = global.rootdir;

// main application ===============================

router.get('*', function(req, res) {
  res.sendFile(rootdir + '/views/home.html');
});

module.exports = router;