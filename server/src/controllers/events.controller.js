const { Event, Booking } = require('../models');
const Joi = require('joi');

const eventSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(''),
  location: Joi.string().allow(''),
  date: Joi.date().required(),
  total_seats: Joi.number().integer().min(0).required(),
  price: Joi.number().precision(2).min(0).required(),
  img: Joi.string().uri().allow('')
});

module.exports = {
  async createEvent(req, res, next) {
    try {
      const { error, value } = eventSchema.validate(req.body);
      if (error) return res.status(400).json({ error: error.message });

      const { total_seats } = value;
      const event = await Event.create({
        ...value,
        available_seats: total_seats
      });
      res.status(201).json(event);
    } catch (err) { next(err); }
  },

  async getEvents(req, res, next) {
    try {
      // support filtering by location/date and search, pagination
      const { location, date, q, page = 1, limit = 20 } = req.query;
      const where = {};
      if (location) where.location = location;
      if (date) where.date = date; // ideally convert/compare range
      if (q) where.title = { [require('sequelize').Op.like]: `%${q}%` };

      const events = await Event.findAll({ where, order: [['date', 'ASC']], limit: parseInt(limit), offset: (page-1)*limit });
      res.json(events);
    } catch (err) { next(err); }
  },

  async getEventById(req, res, next) {
    try {
      const event = await Event.findByPk(req.params.id, { include: [{ model: Booking, as: 'bookings' }] });
      if (!event) return res.status(404).json({ error: 'Event not found' });
      res.json(event);
    } catch (err) { next(err); }
  },

  async updateEvent(req, res, next) {
    try {
      const event = await Event.findByPk(req.params.id);
      if (!event) return res.status(404).json({ error: 'Event not found' });
      const { error, value } = eventSchema.validate(req.body);
      if (error) return res.status(400).json({ error: error.message });

      // if total_seats changed, adjust available_seats proportionally (simple approach)
      if (value.total_seats && value.total_seats !== event.total_seats) {
        const diff = value.total_seats - event.total_seats;
        event.available_seats = Math.max(0, event.available_seats + diff);
      }

      await event.update({ ...value, available_seats: event.available_seats });
      // broadcast new event info via socket
      req.app.locals.io && req.app.locals.io.to(`event_${event.id}`).emit('event-updated', { id: event.id, available_seats: event.available_seats });
      res.json(event);
    } catch (err) { next(err); }
  },

  async deleteEvent(req, res, next) {
    try {
      const event = await Event.findByPk(req.params.id);
      if (!event) return res.status(404).json({ error: 'Event not found' });
      await event.destroy();
      // broadcast deletion
      req.app.locals.io && req.app.locals.io.to(`event_${event.id}`).emit('event-deleted', { id: event.id });
      res.json({ message: 'Event deleted' });
    } catch (err) { next(err); }
  }
};
