const Project = require('../models/Project');
const Task = require('../models/Task');
const Activity = require('../models/Activity');
const User = require('../models/User');

const getDashboardStats = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { members: req.user._id },
        { createdBy: req.user._id }
      ]
    });

    const tasks = await Task.find({
      $or: [
        { assignedTo: req.user._id },
        { createdBy: req.user._id }
      ]
    });

    const completedTasks = tasks.filter(t => t.status === 'completed');
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
    
    const upcomingDeadlines = await Task.find({
      assignedTo: req.user._id,
      status: { $ne: 'completed' },
      deadline: { $gte: new Date() }
    })
      .sort('deadline')
      .limit(5)
      .populate('project', 'title');

    const recentActivities = await Activity.find()
      .populate('user', 'name email avatar')
      .sort('-createdAt')
      .limit(10);

    const teamMembers = await User.find({ isActive: true }).limit(6);

    const projectProgress = projects.map(project => ({
      id: project._id,
      title: project.title,
      progress: project.progress || 0
    }));

    res.json({
      totalProjects: projects.length,
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      inProgressTasks: inProgressTasks.length,
      teamMembers: teamMembers.length,
      upcomingDeadlines,
      recentActivities,
      teamMembersList: teamMembers,
      projectProgress
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
