const Goal = require('../models/Goal');

// GET /api/goals
const getGoals = async (req, res) => {
  try {
    // Optionally support query params later (assigned, status)
    const goals = await Goal.find().populate('assignees', 'name email').sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/goals
const createGoal = async (req, res) => {
  try {
    const { title, description, priority, deadline, assignees, progress } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const goal = new Goal({
      title,
      description: description || '',
      priority: priority || 'medium',
      deadline: deadline || undefined,
      assignees: assignees || [],
      progress: progress || 0,
      createdBy: req.user._id
    });

    await goal.save();
    const populated = await Goal.findById(goal._id).populate('assignees', 'name email');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/goals/:id
const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ message: 'Goal not found' });

    const updatable = ['title', 'description', 'status', 'priority', 'deadline', 'assignees', 'progress'];
    updatable.forEach((key) => {
      if (req.body[key] !== undefined) goal[key] = req.body[key];
    });

    await goal.save();
    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/goals/:id
const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ message: 'Goal not found' });

    await goal.deleteOne();
    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getGoals, updateGoal, createGoal, deleteGoal };
