import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  Users,
  CheckCircle,
  Circle,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('month'); // month, week
  const { api } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/projects')
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
    } catch (error) {
      toast.error('Failed to load calendar data');
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    // Add previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const startPadding = firstDay.getDay();
    for (let i = startPadding - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month, -i),
        isCurrentMonth: false
      });
    }
    
    // Add current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }
    
    // Add next month days
    const endPadding = 42 - days.length;
    for (let i = 1; i <= endPadding; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }
    
    return days;
  };

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.deadline);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  const getProjectsForDate = (date) => {
    return projects.filter(project => {
      const projectDate = new Date(project.deadline);
      return projectDate.toDateString() === date.toDateString();
    });
  };

  const changeMonth = (increment) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1));
  };

  const getWeekDays = () => {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-green-100 text-green-700 border-green-200',
      medium: 'bg-brand-100 text-brand-700 border-blue-200',
      high: 'bg-orange-100 text-orange-700 border-orange-200',
      urgent: 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[priority] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-brand-600" />;
      default: return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const days = getDaysInMonth(currentDate);
  const weekDays = getWeekDays();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="heading-1">Calendar</h1>
          <p className="text-gray-600 mt-1">View and manage your schedule</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('month')}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                view === 'month' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                view === 'week' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
              }`}
            >
              Week
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => changeMonth(-1)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900 min-w-[150px] text-center">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <button
              onClick={() => changeMonth(1)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {weekDays.map((day) => (
            <div key={day} className="py-3 text-center text-sm font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 auto-rows-fr">
          {days.map((day, index) => {
            const dayTasks = getTasksForDate(day.date);
            const dayProjects = getProjectsForDate(day.date);
            const isToday = day.date.toDateString() === new Date().toDateString();
            const hasEvents = dayTasks.length > 0 || dayProjects.length > 0;

            return (
              <div
                key={index}
                onClick={() => setSelectedDate(day.date)}
                className={`min-h-[120px] p-2 border-b border-r border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                  !day.isCurrentMonth ? 'bg-gray-50' : ''
                } ${isToday ? 'bg-brand-50' : ''}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-sm font-medium ${
                    !day.isCurrentMonth ? 'text-gray-400' : 
                    isToday ? 'text-brand-600' : 'text-gray-700'
                  }`}>
                    {day.date.getDate()}
                  </span>
                  {hasEvents && (
                    <div className="h-2 w-2 bg-brand-500 rounded-full"></div>
                  )}
                </div>
                
                <div className="space-y-1">
                  {dayTasks.slice(0, 2).map((task) => (
                    <div
                      key={task._id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTask(task);
                      }}
                      className={`text-xs p-1 rounded ${getPriorityColor(task.priority)} truncate`}
                    >
                      {task.title}
                    </div>
                  ))}
                  {dayTasks.length > 2 && (
                    <div className="text-xs text-gray-500 pl-1">
                      +{dayTasks.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Tasks Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Tasks</h3>
        <div className="space-y-3">
          {tasks
            .filter(task => task.status !== 'completed')
            .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
            .slice(0, 5)
            .map((task) => (
              <div
                key={task._id}
                onClick={() => setSelectedTask(task)}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  {getStatusIcon(task.status)}
                  <div>
                    <p className="font-medium text-gray-900">{task.title}</p>
                    <p className="text-sm text-gray-500">
                      Due: {new Date(task.deadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className={`badge ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
            ))}
          
          {tasks.filter(t => t.status !== 'completed').length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <CalendarIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>No upcoming tasks</p>
              <p className="text-sm mt-1">All caught up! ðŸŽ‰</p>
            </div>
          )}
        </div>
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} onUpdate={fetchData} />
      )}
    </div>
  );
}

// Task Modal Component
function TaskModal({ task, onClose, onUpdate }) {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const { api, user } = useAuth();

  useEffect(() => {
    fetchComments();
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
    if (!comment.trim()) return;
    try {
      await api.post(`/tasks/${task._id}/comments`, { text: comment });
      setComment('');
      fetchComments();
      onUpdate();
    } catch (error) {
      toast.error('Failed to add comment');
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{task.title}</h3>
              <p className="text-sm text-gray-500 mt-1">
                Due: {new Date(task.deadline).toLocaleDateString()}
              </p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              âœ•
            </button>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
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
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <p className="text-sm text-gray-600">{task.description || 'No description'}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
            <div className="space-y-2 max-h-48 overflow-y-auto mb-3">
              {comments.map(c => (
                <div key={c._id} className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs font-medium text-gray-700">{c.user?.name}</p>
                  <p className="text-sm text-gray-600">{c.text}</p>
                </div>
              ))}
            </div>
            <form onSubmit={addComment} className="flex gap-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="input flex-1 text-sm"
              />
              <button type="submit" className="btn-primary px-3">Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

