const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/hoaxController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', ctrl.getHoaxList);
router.get('/:id', ctrl.getHoaxById);
router.post('/', protect, authorize('editor', 'admin'), ctrl.createHoax);

module.exports = router;
