const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

const createTestData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@taskflow.com',
      password: hashedPassword,
      role: 'admin',
      title: 'System Administrator',
      department: 'IT'
    });

    // Create manager user
    const managerPassword = await bcrypt.hash('manager123', salt);
    const managerUser = await User.create({
      name: 'John Manager',
      email: 'john@taskflow.com',
      password: managerPassword,
      role: 'manager',
      title: 'Project Manager',
      department: 'Engineering'
    });

    // Create member users
    const memberPassword = await bcrypt.hash('member123', salt);
    const member1 = await User.create({
      name: 'Alice Developer',
      email: 'alice@taskflow.com',
      password: memberPassword,
      role: 'member',
      title: 'Senior Developer',
      department: 'Engineering'
    });

    const member2 = await User.create({
      name: 'Bob Designer',
      email: 'bob@taskflow.com',
      password: memberPassword,
      role: 'member',
      title: 'UI/UX Designer',
      department: 'Design'
    });

    const member3 = await User.create({
      name: 'Carol Tester',
      email: 'carol@taskflow.com',
      password: memberPassword,
      role: 'member',
      title: 'QA Engineer',
      department: 'Quality Assurance'
    });

    console.log('Created users');

    // Create sample projects
    const project1 = await Project.create({
      title: 'Website Redesign',
      description: 'Complete redesign of company website with modern UI/UX',
      status: 'active',
      priority: 'high',
      deadline: new Date('2024-12-15'),
      members: [managerUser._id, member1._id, member2._id],
      createdBy: adminUser._id,
      progress: 65
    });

    const project2 = await Project.create({
      title: 'Mobile App Development',
      description: 'Develop native mobile app for iOS and Android',
      status: 'planning',
      priority: 'medium',
      deadline: new Date('2025-02-28'),
      members: [managerUser._id, member1._id, member3._id],
      createdBy: adminUser._id,
      progress: 15
    });

    const project3 = await Project.create({
      title: 'Database Migration',
      description: 'Migrate legacy database to new cloud infrastructure',
      status: 'active',
      priority: 'urgent',
      deadline: new Date('2024-11-30'),
      members: [member1._id, member3._id],
      createdBy: managerUser._id,
      progress: 40
    });

    console.log('Created projects');

    // Create sample tasks
    await Task.create([
      {
        title: 'Design Homepage Mockups',
        description: 'Create wireframes and mockups for the new homepage design',
        status: 'completed',
        priority: 'high',
        deadline: new Date('2024-10-15'),
        estimatedHours: 16,
        actualHours: 14,
        assignedTo: member2._id,
        project: project1._id,
        createdBy: managerUser._id
      },
      {
        title: 'Implement Navigation Component',
        description: 'Build responsive navigation component with React',
        status: 'in-progress',
        priority: 'medium',
        deadline: new Date('2024-11-01'),
        estimatedHours: 12,
        actualHours: 8,
        assignedTo: member1._id,
        project: project1._id,
        createdBy: managerUser._id
      },
      {
        title: 'Database Schema Design',
        description: 'Design new database schema for mobile app',
        status: 'todo',
        priority: 'high',
        deadline: new Date('2024-11-15'),
        estimatedHours: 20,
        actualHours: 0,
        assignedTo: member1._id,
        project: project2._id,
        createdBy: managerUser._id
      },
      {
        title: 'User Authentication',
        description: 'Implement login and registration functionality',
        status: 'todo',
        priority: 'high',
        deadline: new Date('2024-12-01'),
        estimatedHours: 24,
        actualHours: 0,
        assignedTo: member1._id,
        project: project2._id,
        createdBy: managerUser._id
      },
      {
        title: 'API Integration Testing',
        description: 'Test all API endpoints for mobile app',
        status: 'todo',
        priority: 'medium',
        deadline: new Date('2024-11-20'),
        estimatedHours: 16,
        actualHours: 0,
        assignedTo: member3._id,
        project: project2._id,
        createdBy: managerUser._id
      },
      {
        title: 'Backup Current Database',
        description: 'Create full backup of existing database before migration',
        status: 'completed',
        priority: 'urgent',
        deadline: new Date('2024-10-20'),
        estimatedHours: 8,
        actualHours: 6,
        assignedTo: member3._id,
        project: project3._id,
        createdBy: managerUser._id
      },
      {
        title: 'Migrate User Data',
        description: 'Transfer user accounts and profiles to new database',
        status: 'in-progress',
        priority: 'urgent',
        deadline: new Date('2024-11-10'),
        estimatedHours: 32,
        actualHours: 18,
        assignedTo: member1._id,
        project: project3._id,
        createdBy: managerUser._id
      }
    ]);

    console.log('Created tasks');

    // Update project progress based on tasks
    const projects = await Project.find();
    for (const project of projects) {
      const tasks = await Task.find({ project: project._id });
      const completedTasks = tasks.filter(t => t.status === 'completed').length;
      const progress = Math.round((completedTasks / tasks.length) * 100);
      
      await Project.findByIdAndUpdate(project._id, { progress });
    }

    console.log('\n✅ Test data created successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Admin: admin@taskflow.com / admin123');
    console.log('Manager: john@taskflow.com / manager123');
    console.log('Member: alice@taskflow.com / member123');
    console.log('Member: bob@taskflow.com / member123');
    console.log('Member: carol@taskflow.com / member123');

  } catch (error) {
    console.error('Error creating test data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
};

// Run the script
createTestData();
