const express = require('express');
const router = express.Router();
const { getDashboardStats, getUsers, getUser, updateUser, updateUserStatus, updateUserRole, approveUser, deleteUser, getAllBookings, getAllReviews, toggleReviewVisibility } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));
router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.put('/users/:id/status', updateUserStatus);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/approve', approveUser);
router.delete('/users/:id', deleteUser);
router.get('/bookings', getAllBookings);
router.get('/reviews', getAllReviews);
router.put('/reviews/:id/toggle-visibility', toggleReviewVisibility);

module.exports = router;
