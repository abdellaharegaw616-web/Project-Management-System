const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema({
  filename: String,
  url: String,
  mimeType: String
}, { _id: false });

const messageSchema = new mongoose.Schema({
  conversationId: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, default: '' },
  attachments: [attachmentSchema]
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
