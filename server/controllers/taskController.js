const Task = require('../models/Task');
const Comment = require('../models/Comment');
const Activity = require('../models/Activity');
const Notification = require('../models/Notification');

const getTasks = async (req, res) => {
  try {
    const { projectId, status, assignedTo } = req.query;
    const filter = {};
    
    if (projectId) filter.project = projectId;
    if (status) filter.status = status;
    if (assignedTo) filter.assignedTo = assignedTo;

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email avatar')
      .populate('project', 'title')
      .populate('createdBy', 'name email')
      .sort('-createdAt');

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, deadline, priority, assignedTo, project, estimatedHours } = req.body;

    const task = await Task.create({
      title,
      description,
      deadline,
      priority,
      assignedTo,
      project,
      estimatedHours,
      createdBy: req.user._id,
      status: 'todo'
    });

    await Activity.create({
      user: req.user._id,
      action: `created task "${title}"`,
      targetType: 'task',
      targetId: task._id
    });

    if (assignedTo && assignedTo.toString() !== req.user._id.toString()) {
      await Notification.create({
        user: assignedTo,
        title: 'New Task Assigned',
        message: `You have been assigned to "${title}"`,
        type: 'task',
        relatedId: task._id
      });
    }

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email avatar')
      .populate('project', 'title')
      .populate('createdBy', 'name email');

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const oldStatus = task.status;
    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate('assignedTo', 'name email avatar')
      .populate('project', 'title')
      .populate('createdBy', 'name email');

    if (oldStatus !== updated.status) {
      await Activity.create({
        user: req.user._id,
        action: `moved task "${task.title}" from ${oldStatus} to ${updated.status}`,
        targetType: 'task',
        targetId: task._id
      });
    } else {
      await Activity.create({
        user: req.user._id,
        action: `updated task "${task.title}"`,
        targetType: 'task',
        targetId: task._id
      });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Comment.deleteMany({ task: task._id });
    await task.deleteOne();

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const taskId = req.params.id;

    const comment = await Comment.create({
      text,
      user: req.user._id,
      task: taskId
    });

    await Activity.create({
      user: req.user._id,
      action: `commented on task`,
      targetType: 'comment',
      targetId: comment._id,
      details: { taskId }
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('user', 'name email avatar');

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTaskComments = async (req, res) => {
  try {
    const comments = await Comment.find({ task: req.params.id })
      .populate('user', 'name email avatar')
      .sort('-createdAt');

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  addComment,
  getTaskComments
};
