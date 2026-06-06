const Message = require('../models/Message');
const path = require('path');

const getConversations = async (req, res) => {
  try {
    // Minimal implementation: aggregate last message per conversation
    const convs = await Message.aggregate([
      { $sort: { createdAt: -1 } },
      { $group: { _id: '$conversationId', lastMessage: { $first: '$text' }, lastAt: { $first: '$createdAt' } } },
      { $project: { conversationId: '$_id', lastMessage: 1, lastAt: 1, _id: 0 } }
    ]);
    res.json(convs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const msgs = await Message.find({ conversationId: req.params.id }).sort({ createdAt: 1 }).populate('sender', 'name');
    res.json(msgs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const files = req.files || [];

    const attachments = files.map(f => ({ filename: f.filename, url: `/uploads/${f.filename}`, mimeType: f.mimetype }));

    const msg = await Message.create({
      conversationId: req.params.id,
      sender: req.user._id,
      text: text || '',
      attachments
    });

    res.status(201).json(msg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getConversations, getMessages, sendMessage };
