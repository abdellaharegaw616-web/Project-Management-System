const SupportMessage = require('../models/SupportMessage');

// POST /api/support/messages
const createSupportMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    // Create support message
    const supportMessage = await SupportMessage.create({
      name,
      email,
      subject,
      message,
      userId: req.user?._id
    });

    res.status(201).json({ 
      message: 'Support message sent successfully',
      data: supportMessage
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/support/messages (admin only)
const getSupportMessages = async (req, res) => {
  try {
    const messages = await SupportMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/support/messages/:id/status (admin only)
const updateMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const message = await SupportMessage.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSupportMessage,
  getSupportMessages,
  updateMessageStatus
};
