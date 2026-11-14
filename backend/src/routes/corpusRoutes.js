const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/corpusController');

router.get('/search', ctrl.searchCorpus);
router.get('/:id/citation', ctrl.getCitation);

module.exports = router;
