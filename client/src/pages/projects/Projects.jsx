import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Users, 
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import ThreeDotMenu from '../../components/common/ThreeDotMenu';
import CreateProjectModal from '../../components/projects/CreateProjectModal';
import toast from 'react-hot-toast';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { api } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      // Mock data for demonstration
      const mockProjects = [
        {
          _id: 1,
          name: 'Website Redesign',
          description: 'Complete overhaul of company website with modern design principles',
          status: 'in-progress',
          progress: 65,
          startDate: '2024-01-01',
          endDate: '2024-02-15',
          team: [
            { name: 'John Doe', role: 'Developer', avatar: 'https://picsum.photos/seed/developer/1.jpg' },
            { name: 'Jane Smith', role: 'Designer', avatar: 'https://picsum.photos/seed/developer/2.jpg' },
            { name: 'Bob Johnson', role: 'Project Manager', avatar: 'https://picsum.photos/seed/developer/3.jpg' }
          ],
          budget: 25000,
          spent: 16250,
          client: { name: 'Acme Corp', email: 'billing@acme.com' },
          tags: ['web', 'design', 'frontend'],
          priority: 'high'
        },
        {
          _id: 2,
          name: 'Mobile App Development',
          description: 'Native iOS and Android app for project management',
          status: 'planning',
          progress: 25,
          startDate: '2024-01-10',
          endDate: '2024-03-31',
          team: [
            { name: 'Alice Brown', role: 'Mobile Developer', avatar: 'https://picsum.photos/seed/developer/4.jpg' },
            { name: 'Charlie Wilson', role: 'Backend Developer', avatar: 'https://picsum.photos/seed/developer/5.jpg' }
          ],
          budget: 45000,
          spent: 11250,
          client: { name: 'Tech Solutions', email: 'projects@techsolutions.com' },
          tags: ['mobile', 'ios', 'android', 'react-native'],
          priority: 'medium'
        },
        {
          _id: 3,
          name: 'Marketing Campaign',
          description: 'Q4 digital marketing campaign across all channels',
          status: 'active',
          progress: 80,
          startDate: '2024-01-05',
          endDate: '2024-01-31',
          team: [
            { name: 'David Lee', role: 'Marketing Manager', avatar: 'https://picsum.photos/seed/developer/6.jpg' },
            { name: 'Emma Davis', role: 'Content Creator', avatar: 'https://picsum.photos/seed/developer/7.jpg' },
            { name: 'Frank Miller', role: 'Social Media Manager', avatar: 'https://picsum.photos/seed/developer/8.jpg' }
          ],
          budget: 30000,
          spent: 24000,
          client: { name: 'Global Brands', email: 'marketing@globalbrands.com' },
          tags: ['marketing', 'social', 'content'],
          priority: 'high'
        },
        {
          _id: 4,
          name: 'Database Migration',
          description: 'Migrate legacy database to modern cloud infrastructure',
          status: 'completed',
          progress: 100,
          startDate: '2023-12-01',
          endDate: '2023-12-15',
          team: [
            { name: 'Grace Chen', role: 'Database Administrator', avatar: 'https://picsum.photos/seed/developer/9.jpg' },
            { name: 'Henry Zhang', role: 'DevOps Engineer', avatar: 'https://picsum.photos/seed/developer/10.jpg' }
          ],
          budget: 15000,
          spent: 14500,
          client: { name: 'Internal IT', email: 'it@internal.com' },
          tags: ['database', 'migration', 'cloud'],
          priority: 'medium'
        }
      ];
      
      setProjects(mockProjects);
    } catch (error) {
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/projects/${id}`);
        toast.success('Project deleted successfully');
        fetchProjects();
      } catch (error) {
        toast.error('Failed to delete project');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      planning: 'badge-warning',
      active: 'badge-primary',
      'on-hold': 'badge-danger',
      completed: 'badge-success',
      archived: 'badge-secondary'
    };
    return colors[status] || 'badge-secondary';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'badge-success',
      medium: 'badge-primary',
      high: 'badge-warning',
      urgent: 'badge-danger'
    };
    return colors[priority] || 'badge-secondary';
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="heading-1">Projects</h1>
          <p className="text-gray-600 mt-1">Manage and track all your projects</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Project
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-9"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input w-40"
          >
            <option value="all">All Status</option>
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="card text-center py-12">
          <FolderKanban className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No projects yet</h3>
          <p className="text-gray-500 mt-1">Get started by creating your first project</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary mt-4 inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project._id} className="card group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">{project.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {project.description || 'No description'}
                  </p>
                </div>
                <ThreeDotMenu
                  items={[
                    { label: 'View', onClick: () => window.location.href = `/projects/${project._id}` },
                    { label: 'Delete', onClick: () => handleDelete(project._id) }
                  ]}
                  align="right"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`badge ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  <span className={`badge ${getPriorityColor(project.priority)}`}>
                    {project.priority}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(project.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{project.team?.length || 0} members</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{project.progress || 0}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gray-900 rounded-full transition-all duration-500"
                      style={{ width: `${project.progress || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchProjects}
      />
    </div>
  );
}

