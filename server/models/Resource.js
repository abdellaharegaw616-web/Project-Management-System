const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['human', 'infrastructure', 'equipment'],
    default: 'human'
  },
  capacity: {
    type: Number,
    default: 40
  },
  allocated: {
    type: Number,
    default: 0
  },
  available: {
    type: Number,
    default: 40
  },
  skills: [{
    type: String
  }],
  utilization: {
    type: Number,
    default: 0
  },
  department: {
    type: String,
    default: ''
  },
  hourlyRate: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Resource', resourceSchema);
