const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendPasswordReset, sendEmail } = require('../utils/emailService');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, nationality } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Name, email and password required' });
    if (password.length < 8) return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });

    const allowedRoles = ['tourist', 'hotel_owner', 'vehicle_owner', 'guide'];
    const userRole = allowedRoles.includes(role) ? role : 'tourist';
    // Provider roles need approval
    const isApproved = userRole === 'tourist';
    const status = isApproved ? 'active' : 'pending_approval';

    const user = await User.create({ name, email, password, role: userRole, phone, nationality, isApproved, status });

    if (!isApproved) {
      // Notify admin
      const admins = await User.find({ role: 'admin' });
      for (const admin of admins) {
        await sendEmail({ to: admin.email, subject: 'New Provider Registration Pending Approval', html: `<p>User <strong>${name}</strong> (${email}) registered as <strong>${userRole}</strong> and requires approval.</p>` });
      }
      return res.status(201).json({ success: true, message: 'Registration submitted. Awaiting admin approval.' });
    }

    const token = signToken(user._id);
    res.status(201).json({ success: true, token, user: { _id: user._id, name: user.name, email: user.email, role: user.role, status: user.status, isApproved: user.isApproved } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    if (user.status === 'suspended') return res.status(403).json({ success: false, message: 'Account suspended. Contact admin.' });
    if (user.status === 'deactivated') return res.status(403).json({ success: false, message: 'Account deactivated.' });
    if (user.status === 'pending_approval') return res.status(403).json({ success: false, message: 'Account pending approval.' });
    const token = signToken(user._id);
    res.json({ success: true, token, user: { _id: user._id, name: user.name, email: user.email, role: user.role, status: user.status, isApproved: user.isApproved, profilePicture: user.profilePicture, preferredLanguage: user.preferredLanguage } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'No account with that email' });
    const token = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save({ validateBeforeSave: false });
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    await sendPasswordReset(email, resetUrl);
    res.json({ success: true, message: 'Password reset email sent' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ passwordResetToken: hashed, passwordResetExpires: { $gt: Date.now() } }).select('+passwordResetToken +passwordResetExpires');
    if (!user) return res.status(400).json({ success: false, message: 'Token invalid or expired' });
    const { password } = req.body;
    if (!password || password.length < 8) return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};
