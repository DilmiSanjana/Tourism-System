const Hotel = require('../models/Hotel');
const Vehicle = require('../models/Vehicle');
const Guide = require('../models/Guide');

exports.getPackageOptions = async (req, res) => {
  try {
    const { district, startDate, endDate } = req.query;
    const hotelFilter = { isActive: true };
    if (district) hotelFilter.district = district;

    const [hotels, vehicles, guides] = await Promise.all([
      Hotel.find(hotelFilter).select('name location district roomTypes images averageRating').limit(20),
      Vehicle.find({ isActive: true }).select('brand model type pricePerDay images averageRating').limit(20),
      Guide.find({ isActive: true }).select('user languages areasServed pricePerDay averageRating').populate('user', 'name').limit(20)
    ]);
    res.json({ success: true, hotels, vehicles, guides });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
