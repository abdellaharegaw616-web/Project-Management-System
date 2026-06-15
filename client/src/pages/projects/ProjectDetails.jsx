import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Calendar, Users, ClipboardList, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { api } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await api.get(`/projects/${id}`);
        setProject(data);
      } catch (error) {
        toast.error('Failed to load project details');
        navigate('/projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [api, id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="btn-secondary inline-flex items-center gap-2"
          onClick={() => navigate('/projects')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </button>
      </div>

      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="heading-1">{project.title}</h1>
            <p className="text-gray-600 mt-1">{project.description || 'No description provided.'}</p>
          </div>
          <div className="space-y-2 text-right">
            <div className="badge badge-primary">{project.status}</div>
            <div className="badge badge-secondary">{project.priority}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="card bg-slate-50 p-4">
            <div className="text-sm text-gray-500 flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4" />
              Deadline
            </div>
            <div className="font-semibold text-gray-900">
              {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'Not set'}
            </div>
          </div>
          <div className="card bg-slate-50 p-4">
            <div className="text-sm text-gray-500 flex items-center gap-2 mb-2">
              <Users className="h-4 w-4" />
              Team members
            </div>
            <div className="font-semibold text-gray-900">{project.members?.length || 0}</div>
          </div>
          <div className="card bg-slate-50 p-4">
            <div className="text-sm text-gray-500 flex items-center gap-2 mb-2">
              <ClipboardList className="h-4 w-4" />
              Progress
            </div>
            <div className="font-semibold text-gray-900">{project.progress || 0}%</div>
          </div>
          <div className="card bg-slate-50 p-4">
            <div className="text-sm text-gray-500 flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4" />
              Created by
            </div>
            <div className="font-semibold text-gray-900">{project.createdBy?.name || 'Unknown'}</div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tasks</h2>
          {project.tasks?.length ? (
            <div className="space-y-3">
              {project.tasks.map((task) => (
                <div key={task._id} className="border rounded-lg p-4 bg-white">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <p className="font-medium text-gray-900">{task.title || task.name}</p>
                    <span className="badge badge-secondary">{task.status}</span>
                  </div>
                  <p className="text-sm text-gray-500">{task.description || 'No task description.'}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-600">No tasks are assigned to this project yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
