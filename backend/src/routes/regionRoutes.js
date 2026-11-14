const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/regionController');

router.get('/', ctrl.getRegions);
router.get('/:slug', ctrl.getRegionBySlug);

module.exports = router;
