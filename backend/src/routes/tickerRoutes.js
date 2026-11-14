const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/tickerController');

router.get('/', ctrl.getTicker);

module.exports = router;
