const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Event = require('./event.model');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  event_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'events',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  mobile: { type: DataTypes.STRING },
  quantity: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 1 },
  total_amount: { type: DataTypes.FLOAT.UNSIGNED, allowNull: false },
  booking_date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  status: { type: DataTypes.ENUM('confirmed', 'cancelled'), allowNull: false, defaultValue: 'confirmed' }
}, {
  tableName: 'bookings'
});

// associations (if used)
Booking.belongsTo(Event, { foreignKey: 'event_id', as: 'event' });
Event.hasMany(Booking, { foreignKey: 'event_id', as: 'bookings' });

module.exports = Booking;
