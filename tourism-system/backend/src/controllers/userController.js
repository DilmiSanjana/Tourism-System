const User = require('../models/User');
const { generateProfilePDF } = require('../utils/pdfService');

exports.getProfile = async (req, res) => {
  res.json({ success: true, user: req.user });
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, nationality, preferredLanguage, profilePicture } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (nationality !== undefined) updates.nationality = nationality;
    if (preferredLanguage) updates.preferredLanguage = preferredLanguage;
    if (profilePicture !== undefined) updates.profilePicture = profilePicture; // base64

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ success: false, message: 'Both passwords required' });
    if (newPassword.length < 8) return res.status(400).json({ success: false, message: 'New password must be at least 8 characters' });
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.matchPassword(currentPassword))) return res.status(400).json({ success: false, message: 'Current password incorrect' });
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password changed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deactivateAccount = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { status: 'deactivated' });
    res.json({ success: true, message: 'Account deactivated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.downloadProfilePDF = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const pdf = await generateProfilePDF(user);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=profile-${user._id}.pdf`);
    res.send(pdf);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const { serviceType, serviceId } = req.body;
    const user = await User.findById(req.user._id);
    const exists = user.wishlist.some(w => w.serviceId.toString() === serviceId && w.serviceType === serviceType);
    if (!exists) {
      user.wishlist.push({ serviceType, serviceId });
      await user.save();
    }
    res.json({ success: true, wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { serviceId } = req.params;
    await User.findByIdAndUpdate(req.user._id, { $pull: { wishlist: { serviceId } } });
    const user = await User.findById(req.user._id);
    res.json({ success: true, wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
