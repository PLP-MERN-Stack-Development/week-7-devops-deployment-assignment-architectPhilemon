const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const User = require('../models/User');
const Event = require('../models/Event');
const StudyGroup = require('../models/StudyGroup');
const Resource = require('../models/Resource');

const router = express.Router();

// Get user profile
router.get('/profile/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ user: user.toJSON() });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, major, year, bio, interests } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user fields
    if (firstName) user.firstName = firstName.trim();
    if (lastName) user.lastName = lastName.trim();
    if (major) user.major = major.trim();
    if (year) user.year = year.trim();
    if (bio) user.bio = bio.trim();
    if (interests) user.interests = interests;
    
    await user.save();
    
    res.json({
      message: 'Profile updated successfully',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Search users
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const { query, university, major, limit = 10 } = req.query;
    
    let searchQuery = { isActive: true };
    
    // Filter by university
    if (university) {
      searchQuery.university = new RegExp(university, 'i');
    }
    
    // Filter by major
    if (major) {
      searchQuery.major = new RegExp(major, 'i');
    }
    
    // Search by name or email
    if (query) {
      const searchRegex = new RegExp(query, 'i');
      searchQuery.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex }
      ];
    }
    
    const users = await User.find(searchQuery)
      .limit(parseInt(limit))
      .select('-password');
    
    const total = await User.countDocuments(searchQuery);
    
    res.json({
      users,
      total
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const [eventsAttended, studyGroupsJoined, resourcesShared] = await Promise.all([
      Event.countDocuments({ attendees: userId }),
      StudyGroup.countDocuments({ members: userId, isActive: true }),
      Resource.countDocuments({ uploadedBy: userId, isActive: true })
    ]);
    
    const stats = {
      eventsAttended,
      studyGroupsJoined,
      resourcesShared,
      connectionsCount: Math.floor(Math.random() * 50) + 10, // Mock data
      achievementPoints: Math.floor(Math.random() * 500) + 100 // Mock data
    };
    
    res.json({ stats });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user achievements
router.get('/achievements', authenticateToken, async (req, res) => {
  try {
    // Mock achievements (in a real app, these would be calculated based on user activity)
    const achievements = [
      {
        id: 1,
        title: 'Early Adopter',
        description: 'One of the first 100 users to join Campus Connect',
        icon: '🌟',
        earnedAt: '2025-01-15T10:00:00Z',
        category: 'milestone'
      },
      {
        id: 2,
        title: 'Study Buddy',
        description: 'Joined 5 study groups',
        icon: '📚',
        earnedAt: '2025-02-01T14:30:00Z',
        category: 'academic'
      },
      {
        id: 3,
        title: 'Event Enthusiast',
        description: 'Attended 10 campus events',
        icon: '🎉',
        earnedAt: '2025-02-15T16:45:00Z',
        category: 'social'
      }
    ];
    
    res.json({ achievements });
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;