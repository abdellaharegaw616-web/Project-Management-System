const Project = require('../models/Project');
const Task = require('../models/Task');
const Activity = require('../models/Activity');

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { members: req.user._id },
        { createdBy: req.user._id }
      ]
    })
      .populate('members', 'name email avatar')
      .populate('createdBy', 'name email')
      .sort('-createdAt');

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProject = async (req, res) => {
  try {
    const { title, description, deadline, priority, members } = req.body;

    const project = await Project.create({
      title,
      description,
      deadline,
      priority,
      members: members || [],
      createdBy: req.user._id,
      status: 'planning'
    });

    await Activity.create({
      user: req.user._id,
      action: `created project "${title}"`,
      targetType: 'project',
      targetId: project._id
    });

    const populatedProject = await Project.findById(project._id)
      .populate('members', 'name email avatar')
      .populate('createdBy', 'name email');

    res.status(201).json(populatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('members', 'name email avatar role')
      .populate('createdBy', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const tasks = await Task.find({ project: project._id })
      .populate('assignedTo', 'name email avatar')
      .sort('-createdAt');

    res.json({ ...project.toObject(), tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate('members', 'name email avatar')
      .populate('createdBy', 'name email');

    await Activity.create({
      user: req.user._id,
      action: `updated project "${project.title}"`,
      targetType: 'project',
      targetId: project._id
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await Task.deleteMany({ project: project._id });
    await project.deleteOne();

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProjectStats = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.id });
    
    const stats = {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'todo').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      review: tasks.filter(t => t.status === 'review').length,
      completed: tasks.filter(t => t.status === 'completed').length
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  getProjectStats
};
