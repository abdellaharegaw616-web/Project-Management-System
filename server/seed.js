const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const salt = await bcrypt.genSalt(10);
    
    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@taskflow.com',
        password: await bcrypt.hash('admin123', salt),
        role: 'admin',
        title: 'Project Director',
        department: 'Management'
      },
      {
        name: 'John Smith',
        email: 'john@taskflow.com',
        password: await bcrypt.hash('password123', salt),
        role: 'manager',
        title: 'Project Manager',
        department: 'Engineering'
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah@taskflow.com',
        password: await bcrypt.hash('password123', salt),
        role: 'member',
        title: 'Senior Developer',
        department: 'Engineering'
      },
      {
        name: 'Mike Chen',
        email: 'mike@taskflow.com',
        password: await bcrypt.hash('password123', salt),
        role: 'member',
        title: 'Frontend Developer',
        department: 'Engineering'
      },
      {
        name: 'Emma Wilson',
        email: 'emma@taskflow.com',
        password: await bcrypt.hash('password123', salt),
        role: 'member',
        title: 'UI/UX Designer',
        department: 'Design'
      }
    ]);

    console.log(`Created ${users.length} users`);

    // Create projects
    const projects = await Project.create([
      {
        title: 'E-Commerce Platform',
        description: 'Build a full-featured e-commerce platform with React and Node.js',
        status: 'active',
        priority: 'high',
        deadline: new Date('2026-06-15'),
        members: [users[1]._id, users[2]._id, users[3]._id],
        createdBy: users[0]._id,
        progress: 65
      },
      {
        title: 'Mobile App Development',
        description: 'Develop iOS and Android mobile app for task management',
        status: 'active',
        priority: 'medium',
        deadline: new Date('2026-07-01'),
        members: [users[2]._id, users[3]._id, users[4]._id],
        createdBy: users[1]._id,
        progress: 40
      },
      {
        title: 'Marketing Website Redesign',
        description: 'Redesign company website with modern UI/UX',
        status: 'planning',
        priority: 'low',
        deadline: new Date('2026-08-20'),
        members: [users[4]._id],
        createdBy: users[1]._id,
        progress: 10
      },
      {
        title: 'API Integration Project',
        description: 'Integrate third-party APIs for payment and analytics',
        status: 'on-hold',
        priority: 'high',
        deadline: new Date('2026-05-30'),
        members: [users[2]._id],
        createdBy: users[0]._id,
        progress: 30
      },
      {
        title: 'Database Migration',
        description: 'Migrate legacy database to new schema',
        status: 'completed',
        priority: 'medium',
        deadline: new Date('2026-04-01'),
        members: [users[1]._id, users[2]._id],
        createdBy: users[0]._id,
        progress: 100
      }
    ]);

    console.log(`Created ${projects.length} projects`);

    // No sample tasks - users will create their own tasks

    // No sample activities - users will create their own activities
    
    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Admin: admin@taskflow.com / admin123');
    console.log('Manager: john@taskflow.com / password123');
    console.log('Member: sarah@taskflow.com / password123');
    console.log('Member: mike@taskflow.com / password123');
    console.log('Member: emma@taskflow.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
