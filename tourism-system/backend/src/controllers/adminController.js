const User = require('../models/User');
const Hotel = require('../models/Hotel');
const Vehicle = require('../models/Vehicle');
const Guide = require('../models/Guide');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const { sendEmail } = require('../utils/emailService');

exports.getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers, activeUsers, suspendedUsers,
      tourists, hotelOwners, vehicleOwners, guides,
      newUsersThisMonth, totalBookings, totalHotels, totalVehicles, pendingApprovals
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: 'active' }),
      User.countDocuments({ status: 'suspended' }),
      User.countDocuments({ role: 'tourist' }),
      User.countDocuments({ role: 'hotel_owner' }),
      User.countDocuments({ role: 'vehicle_owner' }),
      User.countDocuments({ role: 'guide' }),
      User.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Booking.countDocuments(),
      Hotel.countDocuments({ isActive: true }),
      Vehicle.countDocuments({ isActive: true }),
      User.countDocuments({ status: 'pending_approval' })
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers, activeUsers, suspendedUsers,
        tourists, hotelOwners, vehicleOwners, guides,
        newUsersThisMonth, totalBookings, totalHotels, totalVehicles, pendingApprovals
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { name, email, role, status, startDate, endDate, page = 1, limit = 15 } = req.query;
    const filter = {};
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (email) filter.email = { $regex: email, $options: 'i' };
    if (role) filter.role = role;
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find(filter).skip(skip).limit(Number(limit)).sort('-createdAt'),
      User.countDocuments(filter)
    ]);
    res.json({ success: true, users, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.approveUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: true, status: 'active' },
      { new: true }
    );
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    await sendEmail({
      to: user.email,
      subject: 'Account Approved - Tourism Southern Sri Lanka',
      html: `<p>Dear ${user.name}, your account as <strong>${user.role}</strong> has been approved. You can now log in.</p>`
    });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const { status, serviceType, page = 1, limit = 15 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (serviceType) filter.serviceType = serviceType;
    const skip = (page - 1) * limit;
    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate('tourist', 'name email')
        .populate('hotel', 'name').populate('vehicle', 'brand model')
        .skip(skip).limit(Number(limit)).sort('-createdAt'),
      Booking.countDocuments(filter)
    ]);
    res.json({ success: true, bookings, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const { minRating, maxRating, page = 1, limit = 15 } = req.query;
    const filter = {};
    if (minRating || maxRating) {
      filter.rating = {};
      if (minRating) filter.rating.$gte = Number(minRating);
      if (maxRating) filter.rating.$lte = Number(maxRating);
    }
    const skip = (page - 1) * limit;
    const [reviews, total] = await Promise.all([
      Review.find(filter).populate('tourist', 'name email').populate('hotel', 'name').populate('vehicle', 'brand model').skip(skip).limit(Number(limit)).sort('-createdAt'),
      Review.countDocuments(filter)
    ]);
    res.json({ success: true, reviews, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.toggleReviewVisibility = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    review.isVisible = !review.isVisible;
    await review.save();
    res.json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -passwordResetToken -passwordResetExpires');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, phone, nationality, role, status, isApproved, profilePicture } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (nationality !== undefined) user.nationality = nationality;
    if (role !== undefined) user.role = role;
    if (status !== undefined) user.status = status;
    if (isApproved !== undefined) user.isApproved = isApproved;
    if (profilePicture !== undefined) user.profilePicture = profilePicture;
    await user.save();
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
