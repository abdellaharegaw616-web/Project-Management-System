# Project Management System

A comprehensive full-stack project management application built with React, Express.js, and MongoDB. TaskFlow provides teams with tools to manage projects, tasks, resources, and collaborate effectively.

## 🎯 Features

- **Dashboard**: Real-time overview of projects, tasks, and team performance
- **Projects Management**: Create, track, and manage multiple projects with status monitoring
- **Task Management**: Kanban board with drag-and-drop functionality for task organization
- **Resource Planning**: Allocate and optimize team resources with utilization metrics
- **Portfolio View**: Strategic overview of all projects and initiatives
- **Team Collaboration**: Messaging, meetings, and team member management
- **Time Tracking**: Monitor time spent on projects and tasks
- **Finance Management**: Track budgets, expenses, and invoices
- **Calendar**: Integrated calendar with project deadlines and meetings
- **Automations**: Create automated workflows and triggers
- **Goals & Objectives**: Set and track team and project goals
- **Reports**: Generate comprehensive project and performance reports
- **Dark Mode**: Built-in dark mode support for better accessibility

## 🛠 Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router v7** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **React Hot Toast** - Notifications
- **Framer Motion** - Animations
- **Hello Pangea DnD** - Drag and drop functionality

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Multer** - File upload handling

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/abdellaharegaw616-web/Project-Management-System.git
cd Project\ Management\ System
```

2. **Install dependencies**
```bash
npm install
cd server && npm install
cd ../client && npm install
```

3. **Configure environment variables**

Create `.env` file in the root and `server/.env`:

```bash
# .env (root)
NODE_ENV=development

# server/.env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

4. **Start the application**

```bash
# Terminal 1 - Start backend
cd server
npm run dev

# Terminal 2 - Start frontend
cd client
npm run dev
```

Visit `http://localhost:5173`

## 📂 Project Structure

```
Project Management System/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   │   ├── common/              # Common UI components
│   │   │   ├── layout/              # Layout components
│   │   │   ├── projects/            # Project modals
│   │   │   ├── resources/           # Resource modals
│   │   │   └── tasks/               # Task modals
│   │   ├── context/                 # React context (Auth)
│   │   ├── layouts/                 # Page layouts
│   │   ├── pages/                   # Page components
│   │   │   ├── auth/                # Login/Register
│   │   │   ├── dashboard/           # Dashboard
│   │   │   ├── projects/            # Projects
│   │   │   ├── tasks/               # Kanban board
│   │   │   ├── portfolio/           # Portfolio view
│   │   │   ├── resource-planning/   # Resource management
│   │   │   ├── meetings/            # Meetings
│   │   │   ├── messages/            # Messaging
│   │   │   ├── finance/             # Finance tracking
│   │   │   ├── calendar/            # Calendar view
│   │   │   ├── reports/             # Reports
│   │   │   ├── goals/               # Goals management
│   │   │   ├── time-tracking/       # Time tracking
│   │   │   ├── automations/         # Automations
│   │   │   ├── documents/           # Document management
│   │   │   ├── settings/            # Settings
│   │   │   └── team/                # Team management
│   │   ├── App.jsx                  # Main App component
│   │   └── main.jsx                 # Entry point
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
│
├── server/                          # Express.js backend
│   ├── config/                      # Database configuration
│   ├── controllers/                 # Route controllers
│   ├── middleware/                  # Custom middleware
│   ├── models/                      # Mongoose schemas
│   ├── routes/                      # API routes
│   ├── public/uploads/              # Uploaded files
│   ├── server.js                    # Server entry point
│   ├── package.json
│   └── .env                         # Environment variables
│
└── package.json                     # Root package.json
```

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/portfolio` - Get portfolio projects

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Resources
- `GET /api/resources` - Get all resources
- `POST /api/resources` - Create resource
- `PUT /api/resources/:id` - Update resource

### Goals
- `GET /api/goals` - Get all goals
- `POST /api/goals` - Create goal
- `PUT /api/goals/:id` - Update goal

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Teams
- `GET /api/team/members` - Get team members
- `POST /api/team/members` - Add team member

### Notifications
- `GET /api/notifications` - Get notifications

### Messages
- `GET /api/messages/conversations` - Get conversations
- `POST /api/messages` - Send message
- `GET /api/messages/:conversationId` - Get messages

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. User registers or logs in
2. Server returns JWT token
3. Token is stored in localStorage
4. Token is sent with each request via Authorization header
5. Server verifies token before granting access

## 🚢 Deployment

### Option 1: Heroku
```bash
heroku create your-app-name
heroku config:set MONGO_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

### Option 2: DigitalOcean
- Create Ubuntu droplet
- Install Node.js and MongoDB
- Use PM2 for process management
- Setup Nginx as reverse proxy
- Configure SSL with Certbot

### Option 3: Docker
```bash
docker-compose up -d
```

### Option 4: Vercel (Frontend) + Railway (Backend)
- Deploy frontend on Vercel
- Deploy backend on Railway
- Connect services via environment variables

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 📝 Usage

### Create a Project
1. Navigate to Projects page
2. Click "New Project"
3. Fill in project details
4. Set deadline and priority
5. Add team members
6. Click Create

### Manage Tasks
1. Go to Tasks/Kanban Board
2. Create task with title, description, and assignee
3. Drag tasks between columns (Todo, In Progress, Review, Completed)
4. Click task to view details and add comments

### Resource Planning
1. Visit Resource Planning page
2. Click "Add Resource" to add team members
3. Click "Schedule" to plan meetings
4. View utilization metrics and allocations

### Portfolio Overview
1. Portfolio page shows all projects
2. View key metrics (budget, ROI, progress)
3. Filter by status and priority
4. Switch between grid and list views

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

**Abdellah Aregaw**
- GitHub: [@abdellaharegaw616-web](https://github.com/abdellaharegaw616-web)
- Email: abdellaharegaw616@gmail.com

## 🙏 Acknowledgments

- React and Vite communities
- Tailwind CSS for styling
- MongoDB for database
- All contributors and users

## 📞 Support

For issues and questions, please open an issue on [GitHub Issues](https://github.com/abdellaharegaw616-web/Project-Management-System/issues)

---

**Last Updated:** June 6, 2026
