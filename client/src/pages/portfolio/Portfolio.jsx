import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Briefcase, 
  Plus, 
  Search, 
  Filter,
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  Target,
  Flag
} from 'lucide-react';
import toast from 'react-hot-toast';
import CreateProjectModal from '../../components/projects/CreateProjectModal';

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid'); // grid, list, kanban
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const { api } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editProject, setEditProject] = useState({
    id: '',
    name: '',
    description: '',
    status: 'planning',
    priority: 'medium',
    health: 'healthy',
    progress: 0,
    budget: 0,
    spent: 0,
    team: 0,
    startDate: '',
    endDate: '',
    roi: 0,
    strategicAlignment: 0
  });

  useEffect(() => {
    fetchPortfolioProjects();
  }, []);

  const fetchPortfolioProjects = async () => {
    try {
      const { data } = await api.get('/portfolio');
      // Map backend project shape to the UI expected shape
      const mapped = data.map(p => ({
        id: p._id || p.id,
        name: p.title || p.name,
        description: p.description || '',
        status: p.status || 'planning',
        priority: p.priority || 'medium',
        health: p.health || 'healthy',
        progress: p.progress != null ? p.progress : 0,
        budget: p.budget != null ? p.budget : 0,
        spent: p.spent != null ? p.spent : 0,
        team: Array.isArray(p.members) ? p.members.length : (p.team || 0),
        startDate: p.startDate || p.start || '',
        endDate: p.deadline || p.endDate || '',
        roi: p.roi != null ? p.roi : 0,
        strategicAlignment: p.strategicAlignment != null ? p.strategicAlignment : 0
      }));
      setProjects(mapped);
    } catch (error) {
      toast.error('Failed to fetch portfolio projects');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'planning': 'bg-gray-100 text-gray-700',
      'in-progress': 'bg-brand-100 text-brand-700',
      'on-hold': 'bg-yellow-100 text-yellow-700',
      'completed': 'bg-green-100 text-green-700',
      'cancelled': 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'low': 'bg-gray-100 text-gray-700',
      'medium': 'bg-brand-100 text-brand-700',
      'high': 'bg-orange-100 text-orange-700',
      'critical': 'bg-red-100 text-red-700'
    };
    return colors[priority] || 'bg-gray-100 text-gray-700';
  };

  const getHealthColor = (health) => {
    const colors = {
      'healthy': 'bg-green-100 text-green-700',
      'at-risk': 'bg-yellow-100 text-yellow-700',
      'critical': 'bg-red-100 text-red-700'
    };
    return colors[health] || 'bg-gray-100 text-gray-700';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const handleViewProject = (project) => {
    setSelectedProject(project);
    setIsViewModalOpen(true);
  };

  const handleEditProject = (project) => {
    setEditProject({
      id: project.id,
      name: project.name,
      description: project.description,
      status: project.status,
      priority: project.priority,
      health: project.health,
      progress: project.progress,
      budget: project.budget,
      spent: project.spent,
      team: project.team,
      startDate: project.startDate,
      endDate: project.endDate,
      roi: project.roi,
      strategicAlignment: project.strategicAlignment
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateProject = (e) => {
    e.preventDefault();
    setProjects((prev) =>
      prev.map((p) =>
        p.id === editProject.id
          ? {
              ...p,
              name: editProject.name,
              description: editProject.description,
              status: editProject.status,
              priority: editProject.priority,
              health: editProject.health,
              progress: editProject.progress,
              budget: editProject.budget,
              spent: editProject.spent,
              team: editProject.team,
              startDate: editProject.startDate,
              endDate: editProject.endDate,
              roi: editProject.roi,
              strategicAlignment: editProject.strategicAlignment
            }
          : p
      )
    );
    toast.success('Project updated');
    setIsEditModalOpen(false);
    setEditProject({
      id: '',
      name: '',
      description: '',
      status: 'planning',
      priority: 'medium',
      health: 'healthy',
      progress: 0,
      budget: 0,
      spent: 0,
      team: 0,
      startDate: '',
      endDate: '',
      roi: 0,
      strategicAlignment: 0
    });
  };

  const handleDeleteProject = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      toast.success('Project deleted');
    }
  };

  // Use only real projects from server
  const sourceProjects = projects || [];

  const filteredProjects = sourceProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const portfolioStats = {
    totalProjects: sourceProjects.length,
    activeProjects: sourceProjects.filter(p => p.status === 'in-progress' || p.status === 'active').length,
    totalBudget: sourceProjects.reduce((sum, p) => sum + (p.budget || 0), 0),
    totalSpent: sourceProjects.reduce((sum, p) => sum + (p.spent || 0), 0),
    avgROI: sourceProjects.length ? Math.round(sourceProjects.reduce((sum, p) => sum + (p.roi || 0), 0) / sourceProjects.length) : 0,
    healthyProjects: sourceProjects.filter(p => p.health === 'healthy').length
  };

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
          <h1 className="heading-1">Portfolio</h1>
          <p className="text-gray-600 mt-1">Strategic overview of all projects and initiatives</p>
        </div>
        <button onClick={() => setIsCreateOpen(true)} className="btn-primary inline-flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </button>
      </div>
      <CreateProjectModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => fetchPortfolioProjects()}
      />

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-brand-100 rounded-lg flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-brand-600" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{portfolioStats.totalProjects}</h3>
          <p className="text-sm text-gray-600">Total Projects</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-green-600">{portfolioStats.activeProjects} active</span>
            <span className="text-xs text-gray-500">â€¢</span>
            <span className="text-xs text-gray-500">{portfolioStats.totalProjects - portfolioStats.activeProjects} completed</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <BarChart3 className="h-5 w-5 text-brand-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">${(portfolioStats.totalBudget / 1000000).toFixed(1)}M</h3>
          <p className="text-sm text-gray-600">Total Budget</p>
          <div className="mt-3">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${(portfolioStats.totalSpent / portfolioStats.totalBudget) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              ${(portfolioStats.totalSpent / 1000000).toFixed(1)}M spent ({Math.round((portfolioStats.totalSpent / portfolioStats.totalBudget) * 100)}%)
            </p>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{portfolioStats.avgROI}%</h3>
          <p className="text-sm text-gray-600">Average ROI</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-green-600">+12%</span>
            <span className="text-xs text-gray-500">vs target</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search portfolio projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-9"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input w-auto"
          >
            <option value="all">All Status</option>
            <option value="planning">Planning</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="input w-auto"
          >
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-md transition-colors ${
                view === 'grid' ? 'bg-white shadow-sm' : ''
              }`}
            >
              <Briefcase className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-md transition-colors ${
                view === 'list' ? 'bg-white shadow-sm' : ''
              }`}
            >
              <BarChart3 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="card group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">{project.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {project.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleViewProject(project)}
                    className="p-1 rounded-lg hover:bg-gray-100"
                  >
                    <Eye className="h-4 w-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => handleEditProject(project)}
                    className="p-1 rounded-lg hover:bg-gray-100"
                  >
                    <Edit className="h-4 w-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="p-1 rounded-lg hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`badge ${getStatusColor(project.status)}`}>
                    {project.status.replace('-', ' ')}
                  </span>
                  <span className={`badge ${getHealthColor(project.health)}`}>
                    {project.health.replace('-', ' ')}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`badge ${getPriorityColor(project.priority)}`}>
                    {project.priority}
                  </span>
                  <span className="badge bg-purple-100 text-purple-700">
                    ROI: {project.roi}%
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{project.team}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(project.endDate)}</span>
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        project.progress >= 75 ? 'bg-green-500' :
                        project.progress >= 50 ? 'bg-brand-500' :
                        project.progress >= 25 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Budget</span>
                    <span>${(project.spent / 1000).toFixed(0)}k / ${(project.budget / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${(project.spent / project.budget) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Strategic Alignment */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Strategic Alignment</span>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Flag
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(project.strategicAlignment / 20)
                              ? 'text-purple-500 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium text-gray-900">{project.strategicAlignment}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredProjects.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No projects found</h3>
              <p className="text-gray-500 mt-1">
                {searchTerm ? 'Try adjusting your search' : 'Create your first portfolio project to get started'}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Project</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Health</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Progress</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Budget</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">ROI</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Team</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div>
                        <h3 className="font-medium text-gray-900">{project.name}</h3>
                        <p className="text-sm text-gray-500">{project.description}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`badge ${getStatusColor(project.status)}`}>
                        {project.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`badge ${getHealthColor(project.health)}`}>
                        {project.health.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden flex-1 max-w-[80px]">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              project.progress >= 75 ? 'bg-green-500' :
                              project.progress >= 50 ? 'bg-brand-500' :
                              project.progress >= 25 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{project.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      ${(project.spent / 1000).toFixed(0)}k / ${(project.budget / 1000).toFixed(0)}k
                    </td>
                    <td className="py-3 px-4">
                      <span className="badge bg-purple-100 text-purple-700">{project.roi}%</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">{project.team}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewProject(project)}
                          className="p-1 rounded hover:bg-gray-100"
                        >
                          <Eye className="h-4 w-4 text-gray-500" />
                        </button>
                        <button
                          onClick={() => handleEditProject(project)}
                          className="p-1 rounded hover:bg-gray-100"
                        >
                          <Edit className="h-4 w-4 text-gray-500" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="p-1 rounded hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Project Modal */}
      {isViewModalOpen && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl rounded-3xl bg-white shadow-xl ring-1 ring-black/10 overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Project Details</h3>
                <p className="text-sm text-gray-500">View project information</p>
              </div>
              <button
                type="button"
                onClick={() => setIsViewModalOpen(false)}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close view modal"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-xl font-bold text-gray-900">{selectedProject.name}</h4>
                <p className="text-gray-600 mt-2">{selectedProject.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`badge ${getStatusColor(selectedProject.status)}`}>
                    {selectedProject.status.replace('-', ' ')}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <span className={`badge ${getPriorityColor(selectedProject.priority)}`}>
                    {selectedProject.priority}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Health</label>
                  <span className={`badge ${getHealthColor(selectedProject.health)}`}>
                    {selectedProject.health.replace('-', ' ')}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ROI</label>
                  <span className="badge bg-purple-100 text-purple-700">{selectedProject.roi}%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Progress</label>
                  <div className="flex items-center gap-2">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden flex-1">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          selectedProject.progress >= 75 ? 'bg-green-500' :
                          selectedProject.progress >= 50 ? 'bg-brand-500' :
                          selectedProject.progress >= 25 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${selectedProject.progress}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">{selectedProject.progress}%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                  <p className="text-gray-900">${(selectedProject.spent / 1000).toFixed(0)}k / ${(selectedProject.budget / 1000).toFixed(0)}k</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Team Size</label>
                  <p className="text-gray-900">{selectedProject.team} members</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Strategic Alignment</label>
                  <p className="text-gray-900">{selectedProject.strategicAlignment}%</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <p className="text-gray-900">{formatDate(selectedProject.startDate)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <p className="text-gray-900">{formatDate(selectedProject.endDate)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl rounded-3xl bg-white shadow-xl ring-1 ring-black/10 overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Edit Project</h3>
                <p className="text-sm text-gray-500">Update project details</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close edit modal"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdateProject} className="space-y-4 p-6">
              <div>
                <label className="space-y-2 text-sm text-gray-700">
                  Project Name
                  <input
                    type="text"
                    value={editProject.name}
                    onChange={(e) => setEditProject({ ...editProject, name: e.target.value })}
                    className="input w-full"
                    required
                  />
                </label>
              </div>

              <div>
                <label className="space-y-2 text-sm text-gray-700">
                  Description
                  <textarea
                    value={editProject.description}
                    onChange={(e) => setEditProject({ ...editProject, description: e.target.value })}
                    className="input w-full"
                    rows={3}
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="space-y-2 text-sm text-gray-700">
                    Status
                    <select
                      value={editProject.status}
                      onChange={(e) => setEditProject({ ...editProject, status: e.target.value })}
                      className="input w-full"
                    >
                      <option value="planning">Planning</option>
                      <option value="in-progress">In Progress</option>
                      <option value="on-hold">On Hold</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </label>
                </div>
                <div>
                  <label className="space-y-2 text-sm text-gray-700">
                    Priority
                    <select
                      value={editProject.priority}
                      onChange={(e) => setEditProject({ ...editProject, priority: e.target.value })}
                      className="input w-full"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="space-y-2 text-sm text-gray-700">
                    Health
                    <select
                      value={editProject.health}
                      onChange={(e) => setEditProject({ ...editProject, health: e.target.value })}
                      className="input w-full"
                    >
                      <option value="healthy">Healthy</option>
                      <option value="at-risk">At Risk</option>
                      <option value="critical">Critical</option>
                    </select>
                  </label>
                </div>
                <div>
                  <label className="space-y-2 text-sm text-gray-700">
                    Progress (%)
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={editProject.progress}
                      onChange={(e) => setEditProject({ ...editProject, progress: parseInt(e.target.value) || 0 })}
                      className="input w-full"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="space-y-2 text-sm text-gray-700">
                    Budget ($)
                    <input
                      type="number"
                      step="0.01"
                      value={editProject.budget}
                      onChange={(e) => setEditProject({ ...editProject, budget: parseFloat(e.target.value) || 0 })}
                      className="input w-full"
                    />
                  </label>
                </div>
                <div>
                  <label className="space-y-2 text-sm text-gray-700">
                    Spent ($)
                    <input
                      type="number"
                      step="0.01"
                      value={editProject.spent}
                      onChange={(e) => setEditProject({ ...editProject, spent: parseFloat(e.target.value) || 0 })}
                      className="input w-full"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="space-y-2 text-sm text-gray-700">
                    Team Size
                    <input
                      type="number"
                      min="0"
                      value={editProject.team}
                      onChange={(e) => setEditProject({ ...editProject, team: parseInt(e.target.value) || 0 })}
                      className="input w-full"
                    />
                  </label>
                </div>
                <div>
                  <label className="space-y-2 text-sm text-gray-700">
                    ROI (%)
                    <input
                      type="number"
                      step="0.1"
                      value={editProject.roi}
                      onChange={(e) => setEditProject({ ...editProject, roi: parseFloat(e.target.value) || 0 })}
                      className="input w-full"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="space-y-2 text-sm text-gray-700">
                    Start Date
                    <input
                      type="date"
                      value={editProject.startDate}
                      onChange={(e) => setEditProject({ ...editProject, startDate: e.target.value })}
                      className="input w-full"
                    />
                  </label>
                </div>
                <div>
                  <label className="space-y-2 text-sm text-gray-700">
                    End Date
                    <input
                      type="date"
                      value={editProject.endDate}
                      onChange={(e) => setEditProject({ ...editProject, endDate: e.target.value })}
                      className="input w-full"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="space-y-2 text-sm text-gray-700">
                  Strategic Alignment (%)
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editProject.strategicAlignment}
                    onChange={(e) => setEditProject({ ...editProject, strategicAlignment: parseInt(e.target.value) || 0 })}
                    className="input w-full"
                  />
                </label>
              </div>

              <button type="submit" className="btn-primary w-full">
                Update Project
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

