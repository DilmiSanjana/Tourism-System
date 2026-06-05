const Hotel = require('../models/Hotel');
const Booking = require('../models/Booking');

exports.createHotel = async (req, res) => {
  try {
    const data = { ...req.body, owner: req.user._id };
    const hotel = await Hotel.create(data);
    res.status(201).json({ success: true, hotel });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getHotels = async (req, res) => {
  try {
    const { district, minPrice, maxPrice, facilities, search, page = 1, limit = 12 } = req.query;
    const filter = { isActive: true };
    if (district) filter.district = district;
    if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { location: { $regex: search, $options: 'i' } }];
    if (minPrice || maxPrice) filter['roomTypes.price'] = {};
    if (minPrice) filter['roomTypes.price'].$gte = Number(minPrice);
    if (maxPrice) filter['roomTypes.price'].$lte = Number(maxPrice);

    const skip = (page - 1) * limit;
    const [hotels, total] = await Promise.all([
      Hotel.find(filter).populate('owner', 'name email').skip(skip).limit(Number(limit)).sort('-createdAt'),
      Hotel.countDocuments(filter)
    ]);
    res.json({ success: true, hotels, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id).populate('owner', 'name email phone');
    if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });
    res.json({ success: true, hotel });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ _id: req.params.id, owner: req.user._id });
    if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found or not authorized' });
    Object.assign(hotel, req.body);
    await hotel.save();
    res.json({ success: true, hotel });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ _id: req.params.id, owner: req.user._id });
    if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found or not authorized' });
    hotel.isActive = false;
    await hotel.save();
    res.json({ success: true, message: 'Hotel removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.checkAvailability = async (req, res) => {
  try {
    const { hotelId, roomType, startDate, endDate, numberOfRooms = 1 } = req.body;
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });
    const room = hotel.roomTypes.find(r => r.type === roomType);
    if (!room) return res.status(404).json({ success: false, message: 'Room type not found' });

    // Count overlapping confirmed/pending bookings
    const overlapping = await Booking.countDocuments({
      hotel: hotelId,
      roomType,
      status: { $in: ['Pending', 'Confirmed'] },
      $or: [{ startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } }]
    });

    const totalBooked = overlapping; // simplified: treat each booking as 1 room
    const available = room.totalRooms - totalBooked >= numberOfRooms;
    res.json({ success: true, available, totalRooms: room.totalRooms, booked: totalBooked, roomsLeft: room.totalRooms - totalBooked });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find({ owner: req.user._id });
    res.json({ success: true, hotels });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
