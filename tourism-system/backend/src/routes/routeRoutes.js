const express = require('express');
const router = express.Router();
const Route = require('../models/Route');
const { protect, authorize } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const routes = await Route.find({ isActive: true });
    res.json({ success: true, routes });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.use(protect);
router.post('/', authorize('admin'), async (req, res) => {
  try {
    const route = await Route.create(req.body);
    res.status(201).json({ success: true, route });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/:id', authorize('admin'), async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, route });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete('/:id', authorize('admin'), async (req, res) => {
  try {
    await Route.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Route removed' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
