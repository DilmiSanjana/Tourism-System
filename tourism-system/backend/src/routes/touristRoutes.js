const express = require('express');
const router = express.Router();
const { getTouristProfile, updateTouristProfile } = require('../controllers/touristController');
const { protect, authorize } = require('../middleware/auth');
router.use(protect);
router.get('/profile', getTouristProfile);
router.put('/profile', updateTouristProfile);
module.exports = router;
