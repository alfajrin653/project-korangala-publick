const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// 1. Ubah import dari verifyToken menjadi protect sesuai middleware Anda
const { protect } = require('../middleware/auth'); 

// 2. Gunakan protect di rute ini
router.post('/upgrade-citizen', protect, paymentController.createCitizenSubscription);

module.exports = router;