const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/v1/folders', controller.getFolders)
router.post('/v1/folders', controller.newFolder);

module.exports = router;
