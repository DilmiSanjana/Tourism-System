require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cron = require('node-cron');
const { sendBookingReminders } = require('./utils/emailService');

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/tourists', require('./routes/touristRoutes'));
app.use('/api/hotels', require('./routes/hotelRoutes'));
app.use('/api/vehicles', require('./routes/vehicleRoutes'));
app.use('/api/guides', require('./routes/guideRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/packages', require('./routes/packageRoutes'));
app.use('/api/routes', require('./routes/routeRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Server Error' });
});

// DB Connect & Start
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

    // Booking reminder cron: runs every hour
    cron.schedule('0 * * * *', async () => {
      await sendBookingReminders();
    });
  })
  .catch(err => console.error('DB connection error:', err));
