import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, User, Calendar, Clock, MessageSquare, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TaskDetailsModal({ task, onClose, onUpdate }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { api, user } = useAuth();

  useEffect(() => {
    if (task) {
      fetchComments();
    }
  }, [task]);

  const fetchComments = async () => {
    try {
      const { data } = await api.get(`/tasks/${task._id}/comments`);
      setComments(data);
    } catch (error) {
      console.error('Failed to fetch comments');
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setLoading(true);
    try {
      await api.post(`/tasks/${task._id}/comments`, { text: newComment });
      toast.success('Comment added');
      setNewComment('');
      fetchComments();
      onUpdate();
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      await api.put(`/tasks/${task._id}`, { status: newStatus });
      toast.success('Task updated');
      onUpdate();
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative card shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{task.title}</h2>
              <div className="flex items-center gap-3 mt-2">
                <span className={`badge ${
                  task.priority === 'urgent' ? 'badge-danger' :
                  task.priority === 'high' ? 'badge-warning' :
                  'badge-primary'
                }`}>
                  {task.priority}
                </span>
                <select
                  value={task.status}
                  onChange={(e) => updateStatus(e.target.value)}
                  className="input"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            <button onClick={onClose} className="btn-icon">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600">{task.description || 'No description provided'}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 p-4 card-soft">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Assigned to</p>
                <p className="text-sm font-medium">{task.assignedTo?.name || 'Unassigned'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Deadline</p>
                <p className="text-sm font-medium">{new Date(task.deadline).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Estimated Hours</p>
                <p className="text-sm font-medium">{task.estimatedHours || 0} hours</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Created</p>
                <p className="text-sm font-medium">{new Date(task.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Comments */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Comments ({comments.length})
            </h3>
            
            <div className="space-y-4 mb-4 max-h-64 overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment._id} className="flex gap-3">
                  <div className="h-8 w-8 bg-brand-100 rounded-full flex items-center justify-center text-sm font-medium">
                    {comment.user?.name?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="card-soft p-3">
                      <p className="text-sm font-medium text-gray-900">{comment.user?.name}</p>
                      <p className="text-sm text-gray-600 mt-1">{comment.text}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {comments.length === 0 && (
                <p className="text-center text-gray-500 py-4">No comments yet</p>
              )}
            </div>

            <form onSubmit={addComment} className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="input flex-1"
              />
              <button type="submit" disabled={loading} className="btn-primary px-4">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

