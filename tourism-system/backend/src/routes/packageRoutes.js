const express = require('express');
const router = express.Router();
const { getPackageOptions } = require('../controllers/packageController');
router.get('/options', getPackageOptions);
module.exports = router;
