const express = require('express');
const router = express.Router();
const { createVehicle, getVehicles, getVehicle, updateVehicle, deleteVehicle, checkAvailability, estimateFuel, getMyVehicles } = require('../controllers/vehicleController');
const { protect, authorize, requireApproval } = require('../middleware/auth');

// Public routes
router.get('/', getVehicles);
router.post('/check-availability', checkAvailability);
router.post('/estimate-fuel', estimateFuel);

// Protected specific routes BEFORE /:id param
router.get('/my/vehicles', protect, authorize('vehicle_owner', 'admin'), getMyVehicles);
router.post('/', protect, authorize('vehicle_owner', 'admin'), requireApproval, createVehicle);

// Param routes last
router.get('/:id', getVehicle);
router.put('/:id', protect, authorize('vehicle_owner', 'admin'), requireApproval, updateVehicle);
router.delete('/:id', protect, authorize('vehicle_owner', 'admin'), deleteVehicle);

module.exports = router;
