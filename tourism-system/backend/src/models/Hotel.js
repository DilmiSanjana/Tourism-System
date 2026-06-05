const mongoose = require('mongoose');

const roomTypeSchema = new mongoose.Schema({
  type: { type: String, enum: ['Single', 'Double', 'Family', 'Suite', 'Deluxe'], required: true },
  description: String,
  price: { type: Number, required: true, min: 0 },
  capacity: { type: Number, required: true, min: 1 },
  facilities: [String],
  viewType: { type: String, enum: ['Sea View', 'Garden View', 'City View', 'Pool View', 'No View'], default: 'No View' },
  isAC: { type: Boolean, default: true },
  totalRooms: { type: Number, required: true, min: 1 },
  images: [String], // base64
  isAvailable: { type: Boolean, default: true }
});

const hotelSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  description: { type: String },
  location: { type: String, required: true },
  mapLink: { type: String }, // Google Maps link
  district: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  facilities: [String],
  images: [String], // base64
  starRating: { type: Number, min: 1, max: 5 },
  roomTypes: [roomTypeSchema],
  isActive: { type: Boolean, default: true },
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Hotel', hotelSchema);
