import express from 'express';
import StudyGroup from '../models/StudyGroup.js';
import User from '../models/User.js';
import authenticateToken from '../middleware/auth.js';
import validateStudyGroup from '../middleware/validate.js';

const router = express.Router();

// GET /api/study-groups
router.get('/', async (req, res) => {
  try {
    const { subject, search, limit = 10, offset = 0 } = req.query;

    const query = { isActive: true };

    if (subject) query.subject = subject;
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { subject: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    const studyGroups = await StudyGroup.find(query)
      .populate('createdBy', 'firstName lastName')
      .populate('members', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .lean();

    res.json(studyGroups);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/study-groups
router.post('/', authenticateToken, validateStudyGroup, async (req, res) => {
  try {
    const { name, subject, description, capacity } = req.body;

    const newGroup = new StudyGroup({
      name,
      subject,
      description,
      capacity,
      createdBy: req.user.userId,
      members: [req.user.userId]
    });

    const savedGroup = await newGroup.save();
    res.status(201).json(savedGroup);
  } catch (err) {
    res.status(500).json({ message: 'Error creating group', error: err.message });
  }
});

// GET /api/study-groups/user/my-groups
router.get('/user/my-groups', authenticateToken, async (req, res) => {
  try {
    const myGroups = await StudyGroup.find({
      members: req.user.userId,
      isActive: true
    })
      .populate('createdBy', 'firstName lastName')
      .populate('members', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json(myGroups);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching my groups', error: err.message });
  }
});

// GET /api/study-groups/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id)
      .populate('createdBy', 'firstName lastName')
      .populate('members', 'firstName lastName');

    if (!group || !group.isActive) {
      return res.status(404).json({ message: 'Study group not found' });
    }

    res.json(group);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching group', error: err.message });
  }
});

// POST /api/study-groups/:id/join
router.post('/:id/join', authenticateToken, async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id);

    if (!group || !group.isActive) {
      return res.status(404).json({ message: 'Study group not found' });
    }

    if (group.members.includes(req.user.userId)) {
      return res.status(400).json({ message: 'Already a member' });
    }

    if (group.members.length >= group.capacity) {
      return res.status(400).json({ message: 'Study group is full' });
    }

    group.members.push(req.user.userId);
    await group.save();

    res.json({ message: 'Joined successfully', groupId: group._id });
  } catch (err) {
    res.status(500).json({ message: 'Error joining group', error: err.message });
  }
});

// POST /api/study-groups/:id/leave
router.post('/:id/leave', authenticateToken, async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: 'Study group not found' });
    }

    group.members = group.members.filter(
      (memberId) => memberId.toString() !== req.user.userId
    );

    // If user was creator and is leaving, assign new creator
    if (group.createdBy.toString() === req.user.userId && group.members.length > 0) {
      group.createdBy = group.members[0];
    }

    // Deactivate group if empty
    if (group.members.length === 0) {
      group.isActive = false;
    }

    await group.save();
    res.json({ message: 'Left study group', groupId: group._id });
  } catch (err) {
    res.status(500).json({ message: 'Error leaving group', error: err.message });
  }
});

export default router;
