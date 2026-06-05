const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true, minlength: 2, maxlength: 100 },
  email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email'] },
  password: { type: String, required: [true, 'Password is required'], minlength: 8, select: false },
  role: { type: String, enum: ['tourist', 'hotel_owner', 'vehicle_owner', 'guide', 'admin'], default: 'tourist' },
  phone: { type: String, trim: true },
  nationality: { type: String },
  profilePicture: { type: String, default: null }, // stored as base64 in MongoDB
  status: { type: String, enum: ['active', 'suspended', 'pending_approval', 'deactivated'], default: 'active' },
  isApproved: { type: Boolean, default: function() { return this.role === 'tourist' || this.role === 'admin'; } },
  preferredLanguage: { type: String, default: 'en' },
  passwordResetToken: { type: String, select: false },
  passwordResetExpires: { type: Date, select: false },
  wishlist: [{ serviceType: String, serviceId: mongoose.Schema.Types.ObjectId }],
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function(entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
