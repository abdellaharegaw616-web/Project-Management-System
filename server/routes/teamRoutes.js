const express = require('express');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/members', protect, async (req, res) => {
  try {
    const members = await User.find({ organization: req.user.organization }).select('-password');
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/members/:id/role', protect, authorize('admin'), async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/invite', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const { email, name, role, title, department } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Create new user with default password (they should change it on first login)
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash('password123', salt);
    
    const newUser = await User.create({
      name,
      email,
      password: defaultPassword,
      role: role || 'member',
      title: title || 'Team Member',
      department: department || 'Engineering',
      organization: req.user.organization
    });
    
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      title: newUser.title,
      department: newUser.department,
      message: 'Team member invited successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/members/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot remove yourself from the team' });
    }
    
    await user.deleteOne();
    res.json({ message: 'Team member removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
