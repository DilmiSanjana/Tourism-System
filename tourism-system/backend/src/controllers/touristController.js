const User = require('../models/User');

// Tourist profile is just User with role=tourist
// Extra fields like preferences can be in the User model
exports.getTouristProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, tourist: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateTouristProfile = async (req, res) => {
  try {
    const { name, phone, nationality, preferredLanguage, profilePicture } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (nationality !== undefined) updates.nationality = nationality;
    if (preferredLanguage) updates.preferredLanguage = preferredLanguage;
    if (profilePicture !== undefined) updates.profilePicture = profilePicture;
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json({ success: true, tourist: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
