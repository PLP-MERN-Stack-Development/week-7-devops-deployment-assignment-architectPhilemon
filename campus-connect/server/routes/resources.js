const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const Resource = require('../models/Resource');

const router = express.Router();

// Validation middleware
const validateResource = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  body('type')
    .isIn(['notes', 'cheatsheet', 'assignment', 'textbook', 'video', 'other'])
    .withMessage('Please select a valid resource type'),
  body('subject')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Subject must be between 2 and 50 characters'),
  body('course')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Course code must be 20 characters or less'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

// Get all resources
router.get('/', async (req, res) => {
  try {
    const { type, subject, course, search, limit = 20, offset = 0 } = req.query;
    
    let query = { isActive: true };
    
    // Filter by type
    if (type && type !== 'all') {
      query.type = type;
    }
    
    // Filter by subject
    if (subject && subject !== 'all') {
      query.subject = new RegExp(subject, 'i');
    }
    
    // Filter by course
    if (course) {
      query.course = new RegExp(course, 'i');
    }
    
    // Search functionality
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { tags: { $in: [searchRegex] } }
      ];
    }
    
    const resources = await Resource.find(query)
      .populate('uploadedBy', 'firstName lastName')
      .sort({ rating: -1, downloads: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));
    
    const total = await Resource.countDocuments(query);
    
    res.json({
      resources,
      total,
      hasMore: parseInt(offset) + parseInt(limit) < total
    });
  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get single resource
router.get('/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('uploadedBy', 'firstName lastName');
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    res.json({ resource });
  } catch (error) {
    console.error('Get resource error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Upload resource
router.post('/', authenticateToken, validateResource, async (req, res) => {
  try {
    const { title, description, type, subject, course, fileUrl, tags = [] } = req.body;
    
    if (!fileUrl) {
      return res.status(400).json({ message: 'File URL is required' });
    }
    
    const newResource = new Resource({
      title,
      description,
      type,
      subject,
      course: course || '',
      fileUrl,
      uploadedBy: req.user.userId,
      tags: Array.isArray(tags) ? tags : []
    });
    
    await newResource.save();
    await newResource.populate('uploadedBy', 'firstName lastName');
    
    res.status(201).json({
      message: 'Resource uploaded successfully',
      resource: newResource
    });
  } catch (error) {
    console.error('Upload resource error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Download resource (increment download count)
router.post('/:id/download', authenticateToken, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    resource.downloads += 1;
    await resource.save();
    
    res.json({
      message: 'Download recorded',
      downloadUrl: resource.fileUrl,
      downloads: resource.downloads
    });
  } catch (error) {
    console.error('Download resource error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Rate resource
router.post('/:id/rate', authenticateToken, async (req, res) => {
  try {
    const { rating } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    // Calculate new average rating
    const totalRating = (resource.rating * resource.ratingCount) + rating;
    resource.ratingCount += 1;
    resource.rating = totalRating / resource.ratingCount;
    resource.rating = Math.round(resource.rating * 10) / 10; // Round to 1 decimal
    
    await resource.save();
    
    res.json({
      message: 'Rating submitted successfully',
      newRating: resource.rating
    });
  } catch (error) {
    console.error('Rate resource error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user's uploaded resources
router.get('/user/my-uploads', authenticateToken, async (req, res) => {
  try {
    const userResources = await Resource.find({ 
      uploadedBy: req.user.userId,
      isActive: true 
    })
    .populate('uploadedBy', 'firstName lastName')
    .sort({ createdAt: -1 });
    
    res.json({ resources: userResources });
  } catch (error) {
    console.error('Get user resources error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get popular resources
router.get('/popular/trending', async (req, res) => {
  try {
    const popularResources = await Resource.find({ isActive: true })
      .populate('uploadedBy', 'firstName lastName')
      .sort({ downloads: -1, rating: -1 })
      .limit(10);
    
    res.json({ resources: popularResources });
  } catch (error) {
    console.error('Get popular resources error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;