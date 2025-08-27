const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  location: { type: DataTypes.STRING },
  date: { type: DataTypes.DATE, allowNull: false },
  total_seats: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
  available_seats: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
  price: { type: DataTypes.FLOAT.UNSIGNED, allowNull: false, defaultValue: 0.0 },
  img: { type: DataTypes.STRING }
}, {
  tableName: 'events'
});

module.exports = Event;
