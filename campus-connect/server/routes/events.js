const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { validateEvent } = require('../middleware/validation');
const Event = require('../models/Event');

const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
  try {
    const { category, search, limit = 10, offset = 0 } = req.query;
    
    let query = { isActive: true };
    
    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Search functionality
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { location: searchRegex }
      ];
    }
    
    const events = await Event.find(query)
      .populate('createdBy', 'firstName lastName')
      .sort({ date: 1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));
    
    const total = await Event.countDocuments(query);
    
    res.json({
      events,
      total,
      hasMore: parseInt(offset) + parseInt(limit) < total
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'firstName lastName')
      .populate('attendees', 'firstName lastName');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json({ event });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create event
router.post('/', authenticateToken, validateEvent, async (req, res) => {
  try {
    const { title, description, date, location, category, maxAttendees = 50 } = req.body;
    
    const newEvent = new Event({
      title,
      description,
      date,
      location,
      category,
      maxAttendees: parseInt(maxAttendees),
      createdBy: req.user.userId
    });
    
    await newEvent.save();
    await newEvent.populate('createdBy', 'firstName lastName');
    
    res.status(201).json({
      message: 'Event created successfully',
      event: newEvent
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Join event
router.post('/:id/join', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if already joined
    if (event.attendees.includes(req.user.userId)) {
      return res.status(400).json({ message: 'Already joined this event' });
    }
    
    // Check if event is full
    if (event.attendees.length >= event.maxAttendees) {
      return res.status(400).json({ message: 'Event is full' });
    }
    
    event.attendees.push(req.user.userId);
    await event.save();
    
    res.json({
      message: 'Successfully joined event',
      attendeeCount: event.attendees.length
    });
  } catch (error) {
    console.error('Join event error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Leave event
router.post('/:id/leave', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    const attendeeIndex = event.attendees.indexOf(req.user.userId);
    if (attendeeIndex === -1) {
      return res.status(400).json({ message: 'Not joined this event' });
    }
    
    event.attendees.splice(attendeeIndex, 1);
    await event.save();
    
    res.json({
      message: 'Successfully left event',
      attendeeCount: event.attendees.length
    });
  } catch (error) {
    console.error('Leave event error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update event (only creator can update)
router.put('/:id', authenticateToken, validateEvent, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    if (event.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Only event creator can update this event' });
    }
    
    const { title, description, date, location, category, maxAttendees } = req.body;
    
    Object.assign(event, {
      title,
      description,
      date,
      location,
      category,
      maxAttendees: parseInt(maxAttendees)
    });
    
    await event.save();
    await event.populate('createdBy', 'firstName lastName');
    
    res.json({
      message: 'Event updated successfully',
      event
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete event (only creator can delete)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    if (event.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Only event creator can delete this event' });
    }
    
    await Event.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;