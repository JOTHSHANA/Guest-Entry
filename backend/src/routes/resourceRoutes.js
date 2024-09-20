const express = require('express');
const router = express.Router();
const { getRoutes } = require('../controllers/resourceController');

router.get('/routes', getRoutes);

module.exports = router;