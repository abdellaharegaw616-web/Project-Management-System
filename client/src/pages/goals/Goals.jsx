import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Target, 
  Plus, 
  Calendar, 
  Users, 
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle,
  Circle,
  Clock,
  TrendingUp,
  Award,
  Flag
} from 'lucide-react';
import ThreeDotMenu from '../../components/common/ThreeDotMenu';
import toast from 'react-hot-toast';

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', description: '', priority: 'medium', deadline: '' });
  const [view, setView] = useState('all'); // all, active, completed
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('deadline'); // deadline, priority, created
  const { api } = useAuth();

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const { data } = await api.get('/goals');
      setGoals(data);
    } catch (error) {
      toast.error('Failed to fetch goals');
    } finally {
      setLoading(false);
    }
  };

  const updateGoalStatus = async (goalId, status) => {
    try {
      await api.put(`/goals/${goalId}`, { status });
      toast.success('Goal updated');
      fetchGoals();
    } catch (error) {
      toast.error('Failed to update goal');
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-gray-100 text-gray-700',
      medium: 'bg-brand-100 text-brand-700',
      high: 'bg-orange-100 text-orange-700',
      urgent: 'bg-red-100 text-red-700'
    };
    return colors[priority] || 'bg-gray-100 text-gray-700';
  };

  const getStatusColor = (status) => {
    const colors = {
      'not-started': 'bg-gray-100 text-gray-700',
      'in-progress': 'bg-brand-100 text-brand-700',
      'completed': 'bg-green-100 text-green-700',
      'on-hold': 'bg-yellow-100 text-yellow-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-brand-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesView = view === 'all' || 
      (view === 'active' && goal.status !== 'completed') ||
      (view === 'completed' && goal.status === 'completed');
    return matchesSearch && matchesView;
  });

  const sortedGoals = [...filteredGoals].sort((a, b) => {
    switch (sortBy) {
      case 'deadline':
        return new Date(a.deadline) - new Date(b.deadline);
      case 'priority':
        const priorities = { urgent: 4, high: 3, medium: 2, low: 1 };
        return priorities[b.priority] - priorities[a.priority];
      case 'created':
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = {
    total: goals.length,
    active: goals.filter(g => g.status !== 'completed').length,
    completed: goals.filter(g => g.status === 'completed').length,
    onTrack: goals.filter(g => g.progress > 0).length
  };

  return (
    <div className="space-y-6">
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Create New Goal</h3>
              <button onClick={() => setShowNew(false)} className="text-gray-500 hover:text-gray-700">Close</button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              setCreating(true);
              try {
                await api.post('/goals', newGoal);
                toast.success('Goal created');
                setShowNew(false);
                setNewGoal({ title: '', description: '', priority: 'medium', deadline: '' });
                fetchGoals();
              } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to create goal');
              } finally {
                setCreating(false);
              }
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input required value={newGoal.title} onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))} className="input w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={newGoal.description} onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))} className="input w-full h-28" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select value={newGoal.priority} onChange={(e) => setNewGoal(prev => ({ ...prev, priority: e.target.value }))} className="input w-full">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                  <input type="date" value={newGoal.deadline} onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))} className="input w-full" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowNew(false)} className="btn">Cancel</button>
                <button type="submit" disabled={creating} className="btn-primary">{creating ? 'Creating...' : 'Create Goal'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="heading-1">Goals</h1>
          <p className="text-gray-600 mt-1">Set and track your team objectives</p>
        </div>
        <button onClick={() => setShowNew(true)} className="btn-primary inline-flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Goal
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <Target className="h-8 w-8 text-brand-600 mx-auto mb-2" />
          <h3 className="text-2xl font-semibold text-gray-900">{stats.total}</h3>
          <p className="text-sm text-gray-600">Total Goals</p>
        </div>
        <div className="card p-4 text-center">
          <TrendingUp className="h-8 w-8 text-brand-600 mx-auto mb-2" />
          <h3 className="text-2xl font-semibold text-gray-900">{stats.active}</h3>
          <p className="text-sm text-gray-600">Active</p>
        </div>
        <div className="card p-4 text-center">
          <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <h3 className="text-2xl font-semibold text-gray-900">{stats.completed}</h3>
          <p className="text-sm text-gray-600">Completed</p>
        </div>
        <div className="card p-4 text-center">
          <Award className="h-8 w-8 text-brand-600 mx-auto mb-2" />
          <h3 className="text-2xl font-semibold text-gray-900">{stats.onTrack}</h3>
          <p className="text-sm text-gray-600">On Track</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search goals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-9"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('all')}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                view === 'all' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setView('active')}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                view === 'active' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setView('completed')}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                view === 'completed' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
              }`}
            >
              Completed
            </button>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input w-auto"
          >
            <option value="deadline">Sort by Deadline</option>
            <option value="priority">Sort by Priority</option>
            <option value="created">Sort by Created</option>
          </select>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedGoals.map((goal) => (
          <div key={goal._id} className="card group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">{goal.title}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {goal.description || 'No description'}
                </p>
              </div>
              <ThreeDotMenu
                items={[
                  { label: 'Edit', onClick: () => toast('Edit goal (not implemented)') },
                  { label: 'Delete', onClick: () => { if (confirm('Delete this goal?')) { setGoals(prev => prev.filter(g => g._id !== goal._id)); toast('Goal deleted'); } } }
                ]}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`badge ${getPriorityColor(goal.priority)}`}>
                  {goal.priority}
                </span>
                <span className={`badge ${getStatusColor(goal.status)}`}>
                  {goal.status.replace('-', ' ')}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(goal.deadline)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{goal.assignees?.length || 0} assignees</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{goal.progress || 0}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${getProgressColor(goal.progress)}`}
                    style={{ width: `${goal.progress || 0}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3">
                {goal.status !== 'completed' && (
                  <button
                    onClick={() => updateGoalStatus(goal._id, 'completed')}
                    className="btn-outline text-sm"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Complete
                  </button>
                )}
                <button className="p-2 rounded hover:bg-gray-100">
                  <Edit className="h-4 w-4 text-gray-500" />
                </button>
                <button className="p-2 rounded hover:bg-gray-100">
                  <Trash2 className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {sortedGoals.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No goals yet</h3>
            <p className="text-gray-500 mt-1">Create your first goal to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}

