const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { validateStudyGroup } = require('../middleware/validation');
const StudyGroup = require('../models/StudyGroup');

const router = express.Router();

// Get all study groups
router.get('/', async (req, res) => {
  try {
    const { subject, search, limit = 10, offset = 0 } = req.query;
    
    let query = { isActive: true };
    
    // Filter by subject
    if (subject && subject !== 'all') {
      query.subject = new RegExp(subject, 'i');
    }
    
    // Search functionality
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { subject: searchRegex },
        { description: searchRegex }
      ];
    }
    
    const studyGroups = await StudyGroup.find(query)
      .populate('createdBy', 'firstName lastName')
      .populate('members', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));
    
    const total = await StudyGroup.countDocuments(query);
    
    res.json({
      studyGroups,
      total,
      hasMore: parseInt(offset) + parseInt(limit) < total
    });
  } catch (error) {
    console.error('Get study groups error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get single study group
router.get('/:id', async (req, res) => {
  try {
    const studyGroup = await StudyGroup.findById(req.params.id)
      .populate('createdBy', 'firstName lastName')
      .populate('members', 'firstName lastName');
    
    if (!studyGroup) {
      return res.status(404).json({ message: 'Study group not found' });
    }
    
    res.json({ studyGroup });
  } catch (error) {
    console.error('Get study group error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create study group
router.post('/', authenticateToken, validateStudyGroup, async (req, res) => {
  try {
    const { name, subject, description, maxMembers, meetingSchedule, location } = req.body;
    
    const newStudyGroup = new StudyGroup({
      name,
      subject,
      description,
      maxMembers: parseInt(maxMembers),
      members: [req.user.userId], // Creator automatically joins
      createdBy: req.user.userId,
      meetingSchedule: meetingSchedule || 'TBD',
      location: location || 'TBD'
    });
    
    await newStudyGroup.save();
    await newStudyGroup.populate('createdBy', 'firstName lastName');
    await newStudyGroup.populate('members', 'firstName lastName');
    
    res.status(201).json({
      message: 'Study group created successfully',
      studyGroup: newStudyGroup
    });
  } catch (error) {
    console.error('Create study group error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Join study group
router.post('/:id/join', authenticateToken, async (req, res) => {
  try {
    const studyGroup = await StudyGroup.findById(req.params.id);
    if (!studyGroup) {
      return res.status(404).json({ message: 'Study group not found' });
    }
    
    if (!studyGroup.isActive) {
      return res.status(400).json({ message: 'Study group is not active' });
    }
    
    // Check if already a member
    if (studyGroup.members.includes(req.user.userId)) {
      return res.status(400).json({ message: 'Already a member of this study group' });
    }
    
    // Check if group is full
    if (studyGroup.members.length >= studyGroup.maxMembers) {
      return res.status(400).json({ message: 'Study group is full' });
    }
    
    studyGroup.members.push(req.user.userId);
    await studyGroup.save();
    
    res.json({
      message: 'Successfully joined study group',
      memberCount: studyGroup.members.length
    });
  } catch (error) {
    console.error('Join study group error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Leave study group
router.post('/:id/leave', authenticateToken, async (req, res) => {
  try {
    const studyGroup = await StudyGroup.findById(req.params.id);
    if (!studyGroup) {
      return res.status(404).json({ message: 'Study group not found' });
    }
    
    const memberIndex = studyGroup.members.indexOf(req.user.userId);
    if (memberIndex === -1) {
      return res.status(400).json({ message: 'Not a member of this study group' });
    }
    
    // If creator is leaving and there are other members, transfer ownership
    if (studyGroup.createdBy.toString() === req.user.userId && studyGroup.members.length > 1) {
      const newCreator = studyGroup.members.find(id => id.toString() !== req.user.userId);
      studyGroup.createdBy = newCreator;
    }
    
    studyGroup.members.splice(memberIndex, 1);
    
    // If no members left, deactivate the group
    if (studyGroup.members.length === 0) {
      studyGroup.isActive = false;
    }
    
    await studyGroup.save();
    
    res.json({
      message: 'Successfully left study group',
      memberCount: studyGroup.members.length
    });
  } catch (error) {
    console.error('Leave study group error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user's study groups
router.get('/user/my-groups', authenticateToken, async (req, res) => {
  try {
    const userGroups = await StudyGroup.find({ 
      members: req.user.userId, 
      isActive: true 
    })
    .populate('createdBy', 'firstName lastName')
    .populate('members', 'firstName lastName')
    .sort({ createdAt: -1 });
    
    res.json({ studyGroups: userGroups });
  } catch (error) {
    console.error('Get user study groups error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;