const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, changePassword, deactivateAccount, downloadProfilePDF, getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);
router.put('/deactivate', deactivateAccount);
router.get('/profile/download-pdf', downloadProfilePDF);
router.get('/wishlist', getWishlist);
router.post('/wishlist', addToWishlist);
router.delete('/wishlist/:serviceId', removeFromWishlist);

module.exports = router;
