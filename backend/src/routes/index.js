const express = require('express');
const router = express.Router();

// Registrasi seluruh sub-router di satu tempat (single source of truth untuk routing)
router.use('/auth', require('./authRoutes'));
router.use('/articles', require('./articleRoutes'));
router.use('/categories', require('./categoryRoutes'));
router.use('/regions', require('./regionRoutes'));
router.use('/hoax', require('./hoaxRoutes'));
router.use('/ticker', require('./tickerRoutes'));
router.use('/corpus', require('./corpusRoutes'));

module.exports = router;
