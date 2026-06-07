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
  UserCog
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Team() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
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
      <div>
        <h1 className="heading-1">Team Members</h1>
        <p className="text-gray-600 mt-1">Manage your team and their roles</p>
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
                    <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
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
    </div>
  );
}

