const express = require('express');
const Activity = require('../models/Activity');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate('user', 'name email avatar')
      .sort('-createdAt')
      .limit(30);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
