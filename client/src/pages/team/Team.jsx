import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  Mail, 
  Briefcase, 
  Calendar,
  MoreVertical,
  Shield,
  UserMinus,
  UserCog,
  Plus,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Team() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'member', title: '', department: '' });
  const [inviting, setInviting] = useState(false);
  const { api, user } = useAuth();

  useEffect(() => {
    fetchMembers();
  }, [user]);

  useEffect(() => {
    // Clear members when user logs out
    if (!user) {
      setMembers([]);
    }
  }, [user]);

  const fetchMembers = async () => {
    try {
      const { data } = await api.get('/team/members');
      setMembers(data);
    } catch (error) {
      toast.error('Failed to fetch team members');
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (memberId, newRole) => {
    try {
      await api.put(`/team/members/${memberId}/role`, { role: newRole });
      toast.success('Role updated successfully');
      fetchMembers();
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteForm.name || !inviteForm.email) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setInviting(true);
    try {
      await api.post('/team/invite', inviteForm);
      toast.success('Team member invited successfully');
      setShowInviteModal(false);
      setInviteForm({ name: '', email: '', role: 'member', title: '', department: '' });
      fetchMembers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to invite team member');
    } finally {
      setInviting(false);
    }
  };

  const handleRemove = async (memberId) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      try {
        await api.delete(`/team/members/${memberId}`);
        toast.success('Team member removed successfully');
        fetchMembers();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to remove team member');
      }
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: 'badge-danger',
      manager: 'badge-warning',
      member: 'badge-primary'
    };
    return colors[role] || 'badge-secondary';
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
          <h1 className="heading-1">Team Members</h1>
          <p className="text-gray-600 mt-1">Manage your team and their roles</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'manager') && (
          <button
            onClick={() => setShowInviteModal(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Invite Member
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Members</p>
              <p className="text-3xl font-bold text-gray-900">{members.length}</p>
            </div>
            <Users className="h-8 w-8 text-brand-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Admins</p>
              <p className="text-3xl font-bold text-gray-900">
                {members.filter(m => m.role === 'admin').length}
              </p>
            </div>
            <Shield className="h-8 w-8 text-brand-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Managers</p>
              <p className="text-3xl font-bold text-gray-900">
                {members.filter(m => m.role === 'manager').length}
              </p>
            </div>
            <UserCog className="h-8 w-8 text-brand-600" />
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <div key={member._id} className="card">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-brand-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {member.name?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{member.name}</h3>
                  <p className="text-sm text-gray-500">{member.email}</p>
                  <span className={`badge ${getRoleColor(member.role)} mt-1 inline-block`}>
                    {member.role}
                  </span>
                </div>
              </div>
              
              {user?.role === 'admin' && member._id !== user._id && (
                <div className="relative group">
                  <button className="p-1 rounded-lg hover:bg-gray-100">
                    <MoreVertical className="h-4 w-4 text-gray-500" />
                  </button>
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 hidden group-hover:block">
                    <button
                      onClick={() => updateRole(member._id, 'admin')}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Shield className="h-4 w-4" /> Make Admin
                    </button>
                    <button
                      onClick={() => updateRole(member._id, 'manager')}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <UserCog className="h-4 w-4" /> Make Manager
                    </button>
                    <button
                      onClick={() => updateRole(member._id, 'member')}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Users className="h-4 w-4" /> Make Member
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={() => handleRemove(member._id)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <UserMinus className="h-4 w-4" /> Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Briefcase className="h-4 w-4" />
                <span>{member.title || 'Team Member'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                <Mail className="h-4 w-4" />
                <span>{member.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                <Calendar className="h-4 w-4" />
                <span>Joined {new Date(member.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-md mx-4">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Invite Team Member</h3>
            </div>
            <form onSubmit={handleInvite} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    required
                    value={inviteForm.name}
                    onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                    className="input"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                    className="input"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={inviteForm.role}
                    onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                    className="input"
                  >
                    <option value="member">Member</option>
                    <option value="manager">Manager</option>
                    {user?.role === 'admin' && <option value="admin">Admin</option>}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={inviteForm.title}
                    onChange={(e) => setInviteForm({ ...inviteForm, title: e.target.value })}
                    className="input"
                    placeholder="Job title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <input
                    type="text"
                    value={inviteForm.department}
                    onChange={(e) => setInviteForm({ ...inviteForm, department: e.target.value })}
                    className="input"
                    placeholder="Department"
                  />
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowInviteModal(false);
                    setInviteForm({ name: '', email: '', role: 'member', title: '', department: '' });
                  }}
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviting}
                  className="btn-primary"
                >
                  {inviting ? 'Inviting...' : 'Send Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

