/**
 * Run once to seed Southern Sri Lanka routes for fuel estimator:
 *   node seed-routes.js
 */
require('dotenv').config();
const mongoose = require('mongoose');

const routes = [
  { from: 'Colombo', to: 'Galle',        distanceKm: 119, isActive: true },
  { from: 'Colombo', to: 'Matara',       distanceKm: 160, isActive: true },
  { from: 'Colombo', to: 'Hambantota',   distanceKm: 240, isActive: true },
  { from: 'Colombo', to: 'Hikkaduwa',    distanceKm: 100, isActive: true },
  { from: 'Colombo', to: 'Kalutara',     distanceKm: 43,  isActive: true },
  { from: 'Galle',   to: 'Matara',       distanceKm: 44,  isActive: true },
  { from: 'Galle',   to: 'Unawatuna',    distanceKm: 6,   isActive: true },
  { from: 'Galle',   to: 'Mirissa',      distanceKm: 38,  isActive: true },
  { from: 'Galle',   to: 'Tangalle',     distanceKm: 65,  isActive: true },
  { from: 'Galle',   to: 'Hikkaduwa',    distanceKm: 18,  isActive: true },
  { from: 'Galle',   to: 'Weligama',     distanceKm: 28,  isActive: true },
  { from: 'Galle',   to: 'Hambantota',   distanceKm: 121, isActive: true },
  { from: 'Matara',  to: 'Hambantota',   distanceKm: 80,  isActive: true },
  { from: 'Matara',  to: 'Tangalle',     distanceKm: 22,  isActive: true },
  { from: 'Matara',  to: 'Mirissa',      distanceKm: 6,   isActive: true },
  { from: 'Tangalle', to: 'Hambantota',  distanceKm: 58,  isActive: true },
  { from: 'Hikkaduwa', to: 'Weligama',   distanceKm: 46,  isActive: true },
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    await mongoose.connection.db.collection('routes').deleteMany({});
    await mongoose.connection.db.collection('routes').insertMany(
      routes.map(r => ({ ...r, createdAt: new Date(), updatedAt: new Date() }))
    );
    console.log(`✅ ${routes.length} routes seeded for fuel estimator!`);
    process.exit(0);
  })
  .catch(err => { console.error('DB Error:', err.message); process.exit(1); });
