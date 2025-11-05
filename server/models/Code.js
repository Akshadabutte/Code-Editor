const mongoose = require('mongoose');

const CodeSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  code: {
    type: String,
    default: '// Start coding here...\n'
  },
  language: {
    type: String,
    default: 'javascript'
  },
  title: {
    type: String,
    default: 'Untitled'
  },
  description: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: String,
    default: 'Anonymous'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  participants: [{
    userId: String,
    username: String,
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Update the updatedAt field on save
CodeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
CodeSchema.index({ roomId: 1 });
CodeSchema.index({ createdAt: -1 });
CodeSchema.index({ isPublic: 1 });

module.exports = mongoose.model('Code', CodeSchema); 