const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');
const Route = require('../models/Route');

const FUEL_PRICE_PER_LITER = 330; // LKR, can be updated

exports.createVehicle = async (req, res) => {
  try {
    const data = { ...req.body, owner: req.user._id };
    const vehicle = await Vehicle.create(data);
    res.status(201).json({ success: true, vehicle });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getVehicles = async (req, res) => {
  try {
    const { type, location, minPrice, maxPrice, search, page = 1, limit = 12 } = req.query;
    const filter = { isActive: true };
    if (type) filter.type = type;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (minPrice) filter.pricePerDay = { ...filter.pricePerDay, $gte: Number(minPrice) };
    if (maxPrice) filter.pricePerDay = { ...filter.pricePerDay, $lte: Number(maxPrice) };
    if (search) filter.$or = [
      { brand: { $regex: search, $options: 'i' } },
      { model: { $regex: search, $options: 'i' } }
    ];
    const skip = (page - 1) * limit;
    const [vehicles, total] = await Promise.all([
      Vehicle.find(filter).populate('owner', 'name email phone').skip(skip).limit(Number(limit)).sort('-createdAt'),
      Vehicle.countDocuments(filter)
    ]);
    res.json({ success: true, vehicles, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate('owner', 'name email phone');
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
    res.json({ success: true, vehicle });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({ _id: req.params.id, owner: req.user._id });
    if (!vehicle) return res.status(404).json({ success: false, message: 'Not found or not authorized' });
    Object.assign(vehicle, req.body);
    await vehicle.save();
    res.json({ success: true, vehicle });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({ _id: req.params.id, owner: req.user._id });
    if (!vehicle) return res.status(404).json({ success: false, message: 'Not found or not authorized' });
    vehicle.isActive = false;
    await vehicle.save();
    res.json({ success: true, message: 'Vehicle removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.checkAvailability = async (req, res) => {
  try {
    const { vehicleId, startDate, endDate } = req.body;
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });

    const overlapping = await Booking.findOne({
      vehicle: vehicleId,
      status: { $in: ['Pending', 'Confirmed'] },
      startDate: { $lte: new Date(endDate) },
      endDate: { $gte: new Date(startDate) }
    });
    res.json({ success: true, available: !overlapping });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.estimateFuel = async (req, res) => {
  try {
    const { vehicleId, from, to } = req.body;
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });

    let route = await Route.findOne({
      $or: [
        { from: { $regex: from, $options: 'i' }, to: { $regex: to, $options: 'i' } },
        { from: { $regex: to, $options: 'i' }, to: { $regex: from, $options: 'i' } }
      ],
      isActive: true
    });

    if (!route) return res.status(404).json({ success: false, message: 'Route not found. Please contact admin.' });

    const litersNeeded = route.distanceKm / vehicle.fuelEfficiency;
    const estimatedCost = Math.round(litersNeeded * FUEL_PRICE_PER_LITER);

    res.json({
      success: true,
      from: route.from,
      to: route.to,
      distanceKm: route.distanceKm,
      fuelEfficiency: vehicle.fuelEfficiency,
      litersNeeded: Math.round(litersNeeded * 10) / 10,
      estimatedCostLKR: estimatedCost,
      fuelPricePerLiter: FUEL_PRICE_PER_LITER
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ owner: req.user._id });
    res.json({ success: true, vehicles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
