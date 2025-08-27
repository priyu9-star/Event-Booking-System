const sequelize = require('../config/db');
const Event = require('./event.model');
const Booking = require('./booking.model');

module.exports = {
  sequelize,
  Event,
  Booking
};
