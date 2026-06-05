/**
 * Run once to create the admin user:
 *   node seed-admin.js
 * Default credentials: admin@tourism.lk / Admin@1234
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const existing = await mongoose.connection.db.collection('users').findOne({ email: 'admin@tourism.lk' });
    if (existing) {
      console.log('Admin already exists. Skipping.');
      process.exit(0);
    }
    const hash = await bcrypt.hash('Admin@1234', 12);
    await mongoose.connection.db.collection('users').insertOne({
      name: 'Admin',
      email: 'admin@tourism.lk',
      password: hash,
      role: 'admin',
      status: 'active',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('✅ Admin created successfully!');
    console.log('   Email   : admin@tourism.lk');
    console.log('   Password: Admin@1234');
    process.exit(0);
  })
  .catch(err => { console.error('DB Error:', err.message); process.exit(1); });
