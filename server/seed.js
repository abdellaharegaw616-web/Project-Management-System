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

    // Create tasks
    const tasks = await Task.create([
      {
        title: 'Setup authentication system',
        description: 'Implement JWT authentication with refresh tokens',
        status: 'completed',
        priority: 'high',
        deadline: new Date('2026-04-10'),
        assignedTo: users[2]._id,
        project: projects[0]._id,
        createdBy: users[1]._id,
        estimatedHours: 8,
        actualHours: 7
      },
      {
        title: 'Design database schema',
        description: 'Create MongoDB schemas for all collections',
        status: 'completed',
        priority: 'high',
        deadline: new Date('2026-04-05'),
        assignedTo: users[1]._id,
        project: projects[0]._id,
        createdBy: users[0]._id,
        estimatedHours: 6,
        actualHours: 5
      },
      {
        title: 'Build dashboard UI',
        description: 'Create responsive dashboard with statistics',
        status: 'in-progress',
        priority: 'high',
        deadline: new Date('2026-05-20'),
        assignedTo: users[3]._id,
        project: projects[0]._id,
        createdBy: users[1]._id,
        estimatedHours: 12,
        actualHours: 8
      },
      {
        title: 'Implement drag-and-drop kanban',
        description: 'Add drag and drop functionality to task board',
        status: 'todo',
        priority: 'medium',
        deadline: new Date('2026-06-01'),
        assignedTo: users[3]._id,
        project: projects[0]._id,
        createdBy: users[1]._id,
        estimatedHours: 10
      },
      {
        title: 'Create mobile app wireframes',
        description: 'Design wireframes for mobile application',
        status: 'in-progress',
        priority: 'high',
        deadline: new Date('2026-06-10'),
        assignedTo: users[4]._id,
        project: projects[1]._id,
        createdBy: users[1]._id,
        estimatedHours: 15,
        actualHours: 10
      },
      {
        title: 'Setup push notifications',
        description: 'Implement push notifications for task updates',
        status: 'todo',
        priority: 'medium',
        deadline: new Date('2026-06-25'),
        assignedTo: users[2]._id,
        project: projects[1]._id,
        createdBy: users[1]._id,
        estimatedHours: 8
      },
      {
        title: 'Design landing page',
        description: 'Create modern landing page design',
        status: 'review',
        priority: 'low',
        deadline: new Date('2026-07-15'),
        assignedTo: users[4]._id,
        project: projects[2]._id,
        createdBy: users[1]._id,
        estimatedHours: 20,
        actualHours: 18
      },
      {
        title: 'Integrate Stripe payment',
        description: 'Add Stripe payment gateway integration',
        status: 'in-progress',
        priority: 'urgent',
        deadline: new Date('2026-05-25'),
        assignedTo: users[2]._id,
        project: projects[3]._id,
        createdBy: users[0]._id,
        estimatedHours: 16,
        actualHours: 12
      },
      {
        title: 'Write documentation',
        description: 'Create API documentation for developers',
        status: 'completed',
        priority: 'low',
        deadline: new Date('2026-03-28'),
        assignedTo: users[1]._id,
        project: projects[4]._id,
        createdBy: users[0]._id,
        estimatedHours: 10,
        actualHours: 9
      }
    ]);

    console.log(`Created ${tasks.length} tasks`);

    // Create activities (sample)
    const Activity = require('./models/Activity');
    
    await Activity.create([
      {
        user: users[2]._id,
        action: 'completed task "Setup authentication system"',
        targetType: 'task',
        targetId: tasks[0]._id
      },
      {
        user: users[1]._id,
        action: 'created project "E-Commerce Platform"',
        targetType: 'project',
        targetId: projects[0]._id
      },
      {
        user: users[3]._id,
        action: 'updated task "Build dashboard UI"',
        targetType: 'task',
        targetId: tasks[2]._id
      },
      {
        user: users[4]._id,
        action: 'commented on task "Create mobile app wireframes"',
        targetType: 'comment',
        targetId: tasks[4]._id
      }
    ]);

    console.log('Sample data created successfully!');
    
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
