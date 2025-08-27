const { Event, Booking, sequelize } = require('../models');
const Joi = require('joi');
const QRCode = require('qrcode');

const bookingSchema = Joi.object({
  event_id: Joi.number().integer().required(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  mobile: Joi.string().allow(''),
  quantity: Joi.number().integer().min(1).required()
});

module.exports = {
  async createBooking(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { error, value } = bookingSchema.validate(req.body);
      if (error) {
        await t.rollback();
        return res.status(400).json({ error: error.message });
      }

      const { event_id, name, email, mobile, quantity } = value;
      const event = await Event.findByPk(event_id, { transaction: t, lock: t.LOCK.UPDATE });

      if (!event) {
        await t.rollback();
        return res.status(404).json({ error: 'Event not found' });
      }

      if (event.available_seats < quantity) {
        await t.rollback();
        return res.status(400).json({ error: 'Not enough seats available' });
      }

      const total_amount = parseFloat((event.price * quantity).toFixed(2));

      // decrement seats
      event.available_seats = event.available_seats - quantity;
      await event.save({ transaction: t });

      // create booking
      const booking = await Booking.create({
        event_id,
        name,
        email,
        mobile,
        quantity,
        total_amount,
        status: 'confirmed'
      }, { transaction: t });

      await t.commit();

      // generate QR code data (JSON with booking id etc.)
      const qrPayload = JSON.stringify({ bookingId: booking.id, eventId: event.id, name });
      const qrDataUrl = await QRCode.toDataURL(qrPayload);

      // emit socket update to event room so frontends can refresh availability
      req.app.locals.io && req.app.locals.io.to(`event_${event.id}`).emit('seat-update', { eventId: event.id, available_seats: event.available_seats });

      res.status(201).json({
        booking,
        qr: qrDataUrl
      });
    } catch (err) {
      console.error('booking error', err);
      try { await t.rollback(); } catch(e) {}
      next(err);
    }
  }
};
