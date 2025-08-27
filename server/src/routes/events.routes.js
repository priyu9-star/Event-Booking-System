const express = require('express');
const router = express.Router();
const EventsController = require('../controllers/events.controller');

// CRUD
router.post('/', EventsController.createEvent);
router.get('/', EventsController.getEvents);
router.get('/:id', EventsController.getEventById);
router.put('/:id', EventsController.updateEvent);
router.delete('/:id', EventsController.deleteEvent);

module.exports = router;
