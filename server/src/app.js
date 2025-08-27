const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const eventsRoutes = require('./routes/events.routes');
const bookingsRoutes = require('./routes/bookings.routes');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => res.json({ ok: true, message: 'Smart Event Booking API' }));

app.use('/api/events', eventsRoutes);
app.use('/api/bookings', bookingsRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

module.exports = app;
