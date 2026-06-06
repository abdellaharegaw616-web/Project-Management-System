const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: String,
  message: String,
  type: {
    type: String,
    enum: ['task', 'project', 'team', 'system'],
    default: 'system'
  },
  read: {
    type: Boolean,
    default: false
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
