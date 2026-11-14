const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.get('/me', protect, ctrl.me);
router.post('/logout', ctrl.logout); // <-- TAMBAHKAN BARIS INI
router.post('/google', ctrl.googleSignIn);

module.exports = router;
