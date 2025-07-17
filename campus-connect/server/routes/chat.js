const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const ChatRoom = require('../models/ChatRoom');
const Message = require('../models/Message');

const router = express.Router();

// Get chat rooms for user
router.get('/rooms', authenticateToken, async (req, res) => {
  try {
    const userRooms = await ChatRoom.find({ 
      participants: req.user.userId,
      isActive: true 
    })
    .populate('participants', 'firstName lastName')
    .sort({ lastActivity: -1 });
    
    res.json({ rooms: userRooms });
  } catch (error) {
    console.error('Get chat rooms error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create or get direct message room
router.post('/rooms/direct', authenticateToken, async (req, res) => {
  try {
    const { recipientId } = req.body;
    
    if (!recipientId) {
      return res.status(400).json({ message: 'Recipient ID is required' });
    }
    
    if (recipientId === req.user.userId) {
      return res.status(400).json({ message: 'Cannot create room with yourself' });
    }
    
    // Check if room already exists
    const existingRoom = await ChatRoom.findOne({
      type: 'direct',
      participants: { $all: [req.user.userId, recipientId] },
      isActive: true
    }).populate('participants', 'firstName lastName');
    
    if (existingRoom) {
      return res.json({ room: existingRoom });
    }
    
    // Create new room
    const newRoom = new ChatRoom({
      name: 'Direct Message',
      type: 'direct',
      participants: [req.user.userId, recipientId]
    });
    
    await newRoom.save();
    await newRoom.populate('participants', 'firstName lastName');
    
    res.status(201).json({ room: newRoom });
  } catch (error) {
    console.error('Create direct room error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create group chat room
router.post('/rooms/group', authenticateToken, async (req, res) => {
  try {
    const { name, participantIds = [] } = req.body;
    
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: 'Room name is required' });
    }
    
    const participants = [req.user.userId, ...participantIds.filter(id => id !== req.user.userId)];
    
    const newRoom = new ChatRoom({
      name: name.trim(),
      type: 'group',
      participants,
      createdBy: req.user.userId
    });
    
    await newRoom.save();
    await newRoom.populate('participants', 'firstName lastName');
    
    res.status(201).json({ room: newRoom });
  } catch (error) {
    console.error('Create group room error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get messages for a room
router.get('/rooms/:roomId/messages', authenticateToken, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    
    const room = await ChatRoom.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Chat room not found' });
    }
    
    // Check if user is participant
    if (!room.participants.includes(req.user.userId)) {
      return res.status(403).json({ message: 'Access denied to this chat room' });
    }
    
    const messages = await Message.find({ 
      roomId,
      isDeleted: false 
    })
    .populate('senderId', 'firstName lastName')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip(parseInt(offset));
    
    const total = await Message.countDocuments({ roomId, isDeleted: false });
    
    res.json({
      messages: messages.reverse(), // Reverse to show oldest first
      hasMore: parseInt(offset) + parseInt(limit) < total
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Send message
router.post('/rooms/:roomId/messages', authenticateToken, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { content, type = 'text' } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Message content is required' });
    }
    
    const room = await ChatRoom.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Chat room not found' });
    }
    
    // Check if user is participant
    if (!room.participants.includes(req.user.userId)) {
      return res.status(403).json({ message: 'Access denied to this chat room' });
    }
    
    const newMessage = new Message({
      roomId,
      senderId: req.user.userId,
      content: content.trim(),
      type
    });
    
    await newMessage.save();
    await newMessage.populate('senderId', 'firstName lastName');
    
    // Update room's last activity
    room.lastActivity = new Date();
    await room.save();
    
    res.status(201).json({ message: newMessage });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Edit message
router.put('/messages/:messageId', authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Message content is required' });
    }
    
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    if (message.senderId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Can only edit your own messages' });
    }
    
    if (message.isDeleted) {
      return res.status(400).json({ message: 'Cannot edit deleted message' });
    }
    
    message.content = content.trim();
    message.editedAt = new Date();
    await message.save();
    await message.populate('senderId', 'firstName lastName');
    
    res.json({ message });
  } catch (error) {
    console.error('Edit message error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete message
router.delete('/messages/:messageId', authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params;
    
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    if (message.senderId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Can only delete your own messages' });
    }
    
    message.isDeleted = true;
    message.content = '[Message deleted]';
    message.editedAt = new Date();
    await message.save();
    
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;