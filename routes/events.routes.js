const express = require('express');
const router = express.Router();
const Event = require('../models/events.model');
const User = require('../models/user.model.js');

// Render the eventchanges view and pass the event data
router.get('/eventchanges', async (req, res) => {
  try {
    const userId = req.session.currentUser._id;
    const events = await Event.find({ user: userId }).populate('user');
    console.log(events); // Add this line to check the events data in the terminal
    res.render('users/eventchanges', { events, userId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create a new event
router.post('/events', async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.session.currentUser) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const event = new Event({
      bandname: req.body.bandname,
      singer: req.body.singer,
      licensenumber: req.body.licensenumber,
      address: req.body.address,
      email: req.body.email,
      user: req.session.currentUser._id
    });

    const savedEvent = await event.save();
    res.redirect('/myprofile'); // Redirect to myprofile page after successful form submission
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all events
router.get('/events', async (req, res) => {
  try {
    const events = await Event.find().populate('user');
    res.json(events);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a specific event by ID
router.get('/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('user');
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update an event by ID
router.put('/events/:id', async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.session.currentUser) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const eventId = req.params.id;
    const userId = req.session.currentUser._id;

    const updatedEvent = {
      bandname: req.body.bandname,
      singer: req.body.singer,
      licensenumber: req.body.licensenumber,
      address: req.body.address,
      email: req.body.email,
      user: userId
    };

    const event = await Event.findOneAndUpdate(
      { _id: eventId, user: userId },
      updatedEvent,
      { new: true }
    ).populate('user');

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json({ message: 'Event updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete an event by ID
router.delete('/events/:id', async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.session.currentUser) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const event = await Event.findByIdAndDelete(req.params.id).populate('user');
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Render the registeredevents view and pass the event data
router.get('/registeredevents', async (req, res) => {
  try {
    const userId = req.session.currentUser._id;
    const events = await Event.find({ user: userId }).populate('user');
    console.log(events); // Add this line to check the events data in the terminal
    res.render('users/registeredevents', { events, userId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;