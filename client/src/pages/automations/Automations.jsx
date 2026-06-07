import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Zap, 
  Plus, 
  Search, 
  Filter,
  Play,
  Pause,
  Edit,
  Trash2,
  Copy,
  ArrowRight,
  Settings,
  Clock,
  CheckCircle,
  AlertTriangle,
  MoreVertical,
  Code2,
  Mail,
  Bell,
  Calendar,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Automations() {
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, paused, error
  const [triggerFilter, setTriggerFilter] = useState('all'); // all, webhook, schedule, email, manual
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAutomation, setSelectedAutomation] = useState(null);
  const [newAutomation, setNewAutomation] = useState({
    name: '',
    description: '',
    trigger: '',
    triggerType: 'webhook',
    actions: [],
  });
  const { api } = useAuth();

  useEffect(() => {
    fetchAutomations();
  }, []);

  const fetchAutomations = async () => {
    try {
      const { data } = await api.get('/automations');
      setAutomations(data || []);
    } catch (error) {
      console.error('Failed to fetch automations');
      setAutomations([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleAutomation = (automationId, status) => {
    setAutomations((prev) =>
      prev.map((a) =>
        a.id === automationId ? { ...a, status } : a
      )
    );
    toast.success(`Automation ${status === 'active' ? 'activated' : 'paused'}`);
  };

  const handleCopyAutomation = (automation) => {
    const copiedAutomation = {
      ...automation,
      id: Date.now(),
      name: `${automation.name} (Copy)`,
      status: 'draft',
      runs: 0,
      lastRun: new Date().toISOString(),
    };
    setAutomations((prev) => [copiedAutomation, ...prev]);
    toast.success('Automation copied');
  };

  const handleEditAutomation = (automation) => {
    setSelectedAutomation(automation);
    setNewAutomation({
      name: automation.name,
      description: automation.description,
      trigger: automation.trigger,
      triggerType: automation.triggerType,
      actions: automation.actions,
    });
    setShowEditModal(true);
  };

  const handleDeleteAutomation = (automationId) => {
    if (window.confirm('Are you sure you want to delete this automation?')) {
      setAutomations((prev) => prev.filter((a) => a.id !== automationId));
      toast.success('Automation deleted');
    }
  };

  const handleCreateAutomation = (e) => {
    e.preventDefault();
    const automation = {
      id: Date.now(),
      name: newAutomation.name,
      description: newAutomation.description,
      trigger: newAutomation.trigger,
      triggerType: newAutomation.triggerType,
      actions: newAutomation.actions,
      status: 'active',
      runs: 0,
      lastRun: new Date().toISOString(),
      successRate: 100,
    };
    setAutomations((prev) => [automation, ...prev]);
    toast.success('Automation created');
    setShowCreateModal(false);
    setNewAutomation({ name: '', description: '', trigger: '', triggerType: 'webhook', actions: [] });
  };

  const handleUpdateAutomation = (e) => {
    e.preventDefault();
    setAutomations((prev) =>
      prev.map((a) =>
        a.id === selectedAutomation.id
          ? {
              ...a,
              name: newAutomation.name,
              description: newAutomation.description,
              trigger: newAutomation.trigger,
              triggerType: newAutomation.triggerType,
              actions: newAutomation.actions,
            }
          : a
      )
    );
    toast.success('Automation updated');
    setShowEditModal(false);
    setSelectedAutomation(null);
    setNewAutomation({ name: '', description: '', trigger: '', triggerType: 'webhook', actions: [] });
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-700',
      paused: 'bg-yellow-100 text-yellow-700',
      error: 'bg-red-100 text-red-700',
      draft: 'bg-gray-100 text-gray-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getTriggerIcon = (trigger) => {
    const icons = {
      'webhook': Code2,
      'schedule': Calendar,
      'email': Mail,
      'manual': Settings
    };
    return icons[trigger] || Settings;
  };

  const getActionIcon = (action) => {
    const icons = {
      'send-email': Mail,
      'create-task': FileText,
      'notify': Bell,
      'update-status': CheckCircle
    };
    return icons[action] || Settings;
  };

  const filteredAutomations = automations.filter(automation => {
    const matchesSearch = automation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         automation.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || automation.status === statusFilter;
    const matchesTrigger = triggerFilter === 'all' || automation.triggerType === triggerFilter;
    return matchesSearch && matchesStatus && matchesTrigger;
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
          <h1 className="heading-1">Automations</h1>
          <p className="text-gray-600 mt-1">Streamline workflows with intelligent automation</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Automation
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <Zap className="h-8 w-8 text-brand-600 mx-auto mb-2" />
          <h3 className="text-2xl font-semibold text-gray-900">{automations.length}</h3>
          <p className="text-sm text-gray-600">Total Automations</p>
        </div>
        <div className="card p-4 text-center">
          <Play className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <h3 className="text-2xl font-semibold text-gray-900">
            {automations.filter(a => a.status === 'active').length}
          </h3>
          <p className="text-sm text-gray-600">Active</p>
        </div>
        <div className="card p-4 text-center">
          <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
          <h3 className="text-2xl font-semibold text-gray-900">
            {automations.reduce((total, a) => total + (a.runs || 0), 0)}
          </h3>
          <p className="text-sm text-gray-600">Total Runs</p>
        </div>
        <div className="card p-4 text-center">
          <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <h3 className="text-2xl font-semibold text-gray-900">
            {automations.length > 0 ? Math.round(automations.reduce((total, a) => total + (a.successRate || 0), 0) / automations.length) : 0}%
          </h3>
          <p className="text-sm text-gray-600">Avg Success Rate</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search automations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-9"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['all', 'active', 'paused', 'error'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-md text-sm transition-colors capitalize ${
                  statusFilter === status ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="btn-outline"
            >
              <Filter className="h-4 w-4" />
              {triggerFilter !== 'all' && (
                <span className="ml-1 px-2 py-0.5 bg-brand-500 text-white text-xs rounded-full">
                  {triggerFilter}
                </span>
              )}
            </button>
            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="p-2">
                  <p className="text-xs font-medium text-gray-500 mb-2">Filter by Trigger</p>
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setTriggerFilter('all');
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        triggerFilter === 'all' ? 'bg-brand-100 text-brand-700' : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      All Triggers
                    </button>
                    <button
                      onClick={() => {
                        setTriggerFilter('webhook');
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        triggerFilter === 'webhook' ? 'bg-brand-100 text-brand-700' : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      Webhook
                    </button>
                    <button
                      onClick={() => {
                        setTriggerFilter('schedule');
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        triggerFilter === 'schedule' ? 'bg-brand-100 text-brand-700' : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      Schedule
                    </button>
                    <button
                      onClick={() => {
                        setTriggerFilter('email');
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        triggerFilter === 'email' ? 'bg-brand-100 text-brand-700' : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      Email
                    </button>
                    <button
                      onClick={() => {
                        setTriggerFilter('manual');
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        triggerFilter === 'manual' ? 'bg-brand-100 text-brand-700' : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      Manual
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Automations List */}
      <div className="space-y-4">
        {filteredAutomations.map((automation) => (
          <div key={automation.id} className="card group">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-12 w-12 bg-brand-100 rounded-lg flex items-center justify-center">
                    <Zap className="h-6 w-6 text-brand-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">{automation.name}</h3>
                    <p className="text-sm text-gray-500">{automation.description}</p>
                  </div>
                  <span className={`badge ${getStatusColor(automation.status)}`}>
                    {automation.status}
                  </span>
                </div>

                {/* Workflow */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      {React.createElement(getTriggerIcon(automation.triggerType), { className: 'h-4 w-4 text-gray-600' })}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Trigger</p>
                      <p className="text-sm font-medium text-gray-900">{automation.trigger}</p>
                    </div>
                  </div>
                  
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                  
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      {React.createElement(getActionIcon(automation.actions[0]), { className: 'h-4 w-4 text-gray-600' })}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Action</p>
                      <p className="text-sm font-medium text-gray-900">{automation.actions[0]}</p>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{automation.runs} runs</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    <span>{automation.successRate}% success rate</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Last run: {new Date(automation.lastRun).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => toggleAutomation(automation.id, automation.status === 'active' ? 'paused' : 'active')}
                  className={`p-2 rounded-lg transition-colors ${
                    automation.status === 'active'
                      ? 'hover:bg-yellow-100 text-yellow-600'
                      : 'hover:bg-green-100 text-green-600'
                  }`}
                >
                  {automation.status === 'active' ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => handleCopyAutomation(automation)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <Copy className="h-4 w-4 text-gray-500" />
                </button>
                <button
                  onClick={() => handleEditAutomation(automation)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <Edit className="h-4 w-4 text-gray-500" />
                </button>
                <button
                  onClick={() => handleDeleteAutomation(automation.id)}
                  className="p-2 rounded-lg hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredAutomations.length === 0 && (
          <div className="text-center py-12">
            <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No automations found</h3>
            <p className="text-gray-500 mt-1">
              {searchTerm ? 'Try adjusting your search' : 'Create your first automation to get started'}
            </p>
          </div>
        )}
      </div>

      {/* Create Automation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Automation</h2>

            <form onSubmit={handleCreateAutomation} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  placeholder="Enter automation name"
                  value={newAutomation.name}
                  onChange={(e) => setNewAutomation({ ...newAutomation, name: e.target.value })}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  placeholder="Describe what this automation does"
                  value={newAutomation.description}
                  onChange={(e) => setNewAutomation({ ...newAutomation, description: e.target.value })}
                  className="input"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trigger Type</label>
                  <select
                    value={newAutomation.triggerType}
                    onChange={(e) => setNewAutomation({ ...newAutomation, triggerType: e.target.value })}
                    className="input"
                  >
                    <option value="webhook">Webhook</option>
                    <option value="schedule">Schedule</option>
                    <option value="email">Email</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trigger Event</label>
                  <input
                    type="text"
                    placeholder="e.g. user.created"
                    value={newAutomation.trigger}
                    onChange={(e) => setNewAutomation({ ...newAutomation, trigger: e.target.value })}
                    className="input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Actions (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. send-email, create-task"
                  value={newAutomation.actions.join(', ')}
                  onChange={(e) => setNewAutomation({ ...newAutomation, actions: e.target.value.split(',').map(a => a.trim()) })}
                  className="input"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewAutomation({ name: '', description: '', trigger: '', triggerType: 'webhook', actions: [] });
                  }}
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Automation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Automation Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Automation</h2>

            <form onSubmit={handleUpdateAutomation} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  placeholder="Enter automation name"
                  value={newAutomation.name}
                  onChange={(e) => setNewAutomation({ ...newAutomation, name: e.target.value })}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  placeholder="Describe what this automation does"
                  value={newAutomation.description}
                  onChange={(e) => setNewAutomation({ ...newAutomation, description: e.target.value })}
                  className="input"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trigger Type</label>
                  <select
                    value={newAutomation.triggerType}
                    onChange={(e) => setNewAutomation({ ...newAutomation, triggerType: e.target.value })}
                    className="input"
                  >
                    <option value="webhook">Webhook</option>
                    <option value="schedule">Schedule</option>
                    <option value="email">Email</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trigger Event</label>
                  <input
                    type="text"
                    placeholder="e.g. user.created"
                    value={newAutomation.trigger}
                    onChange={(e) => setNewAutomation({ ...newAutomation, trigger: e.target.value })}
                    className="input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Actions (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. send-email, create-task"
                  value={newAutomation.actions.join(', ')}
                  onChange={(e) => setNewAutomation({ ...newAutomation, actions: e.target.value.split(',').map(a => a.trim()) })}
                  className="input"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedAutomation(null);
                    setNewAutomation({ name: '', description: '', trigger: '', triggerType: 'webhook', actions: [] });
                  }}
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Update Automation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

