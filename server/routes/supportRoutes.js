const express = require('express');
const { createSupportMessage, getSupportMessages, updateMessageStatus } = require('../controllers/supportController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// POST /api/support/messages - Create a new support message
router.post('/messages', protect, createSupportMessage);

// GET /api/support/messages - Get all support messages (admin only)
router.get('/messages', protect, getSupportMessages);

// PUT /api/support/messages/:id/status - Update message status (admin only)
router.put('/messages/:id/status', protect, updateMessageStatus);

module.exports = router;
