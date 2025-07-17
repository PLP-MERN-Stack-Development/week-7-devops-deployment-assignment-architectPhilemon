const mongoose = require('mongoose');

const studyGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  maxMembers: {
    type: Number,
    required: true,
    min: 2,
    max: 50,
    default: 8
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  meetingSchedule: {
    type: String,
    trim: true,
    default: 'TBD'
  },
  location: {
    type: String,
    trim: true,
    default: 'TBD'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
studyGroupSchema.index({ subject: 1, isActive: 1 });
studyGroupSchema.index({ createdBy: 1 });

module.exports = mongoose.model('StudyGroup', studyGroupSchema);