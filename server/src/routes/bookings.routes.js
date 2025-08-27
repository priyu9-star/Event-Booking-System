const express = require('express');
const router = express.Router();
const BookingsController = require('../controllers/bookings.controller');

router.post('/', BookingsController.createBooking);

module.exports = router;
