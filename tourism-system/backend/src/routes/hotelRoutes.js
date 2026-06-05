const express = require('express');
const router = express.Router();
const { createHotel, getHotels, getHotel, updateHotel, deleteHotel, checkAvailability, getMyHotels } = require('../controllers/hotelController');
const { protect, authorize, requireApproval } = require('../middleware/auth');

// Public routes
router.get('/', getHotels);
router.post('/check-availability', checkAvailability);

// Protected specific routes BEFORE /:id param
router.get('/my/hotels', protect, authorize('hotel_owner', 'admin'), getMyHotels);
router.post('/', protect, authorize('hotel_owner', 'admin'), requireApproval, createHotel);

// Param routes last
router.get('/:id', getHotel);
router.put('/:id', protect, authorize('hotel_owner', 'admin'), requireApproval, updateHotel);
router.delete('/:id', protect, authorize('hotel_owner', 'admin'), deleteHotel);

module.exports = router;
