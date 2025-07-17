const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  type: {
    type: String,
    required: true,
    enum: ['notes', 'cheatsheet', 'assignment', 'textbook', 'video', 'other']
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  course: {
    type: String,
    trim: true,
    maxlength: 20,
    default: ''
  },
  fileUrl: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  downloads: {
    type: Number,
    default: 0,
    min: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  ratingCount: {
    type: Number,
    default: 0,
    min: 0
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
resourceSchema.index({ type: 1, subject: 1, isActive: 1 });
resourceSchema.index({ uploadedBy: 1 });
resourceSchema.index({ tags: 1 });

module.exports = mongoose.model('Resource', resourceSchema);