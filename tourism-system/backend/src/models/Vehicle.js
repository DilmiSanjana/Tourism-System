const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['Car', 'Van', 'Bike', 'Bus', 'Tuk-Tuk', 'SUV'], required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number },
  registrationNumber: { type: String, required: true, unique: true },
  seats: { type: Number, required: true, min: 1 },
  fuelType: { type: String, enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'], required: true },
  fuelEfficiency: { type: Number, required: true, min: 1 }, // km per liter
  pricePerDay: { type: Number, required: true, min: 0 },
  location: { type: String, required: true },
  images: [String], // base64
  features: [String],
  isAvailable: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
