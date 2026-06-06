import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, MoreVertical, Clock, User, Calendar } from 'lucide-react';
import CreateTaskModal from '../../components/tasks/CreateTaskModal';
import TaskDetailsModal from '../../components/tasks/TaskDetailsModal';
import toast from 'react-hot-toast';

const columns = [
  { id: 'todo', title: 'To Do', color: 'bg-gray-100' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-brand-50' },
  { id: 'review', title: 'Review', color: 'bg-yellow-50' },
  { id: 'completed', title: 'Completed', color: 'bg-green-50' }
];

export default function KanbanBoard({ projectId }) {
  const [tasks, setTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const { api } = useAuth();

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      const url = projectId ? `/tasks?projectId=${projectId}` : '/tasks';
      const { data } = await api.get(url);
      
      const groupedTasks = {
        todo: data.filter(t => t.status === 'todo'),
        'in-progress': data.filter(t => t.status === 'in-progress'),
        review: data.filter(t => t.status === 'review'),
        completed: data.filter(t => t.status === 'completed')
      };
      setTasks(groupedTasks);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId) return;

    // Move task locally
    const sourceTasks = [...tasks[source.droppableId]];
    const destTasks = [...tasks[destination.droppableId]];
    const [movedTask] = sourceTasks.splice(source.index, 1);
    movedTask.status = destination.droppableId;
    destTasks.splice(destination.index, 0, movedTask);

    setTasks({
      ...tasks,
      [source.droppableId]: sourceTasks,
      [destination.droppableId]: destTasks
    });

    // Update in database
    try {
      await api.put(`/tasks/${draggableId}`, { status: destination.droppableId });
      toast.success('Task moved successfully');
    } catch (error) {
      toast.error('Failed to update task');
      fetchTasks(); // Revert on error
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-green-100 text-green-700',
      medium: 'bg-brand-100 text-brand-700',
      high: 'bg-orange-100 text-orange-700',
      urgent: 'bg-red-100 text-red-700'
    };
    return colors[priority] || 'bg-gray-100 text-gray-700';
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
      <div className="flex justify-between items-center">
        <h1 className="heading-1">Task Board</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((column) => (
            <div key={column.id} className={`${column.color} rounded-xl p-4`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">{column.title}</h3>
                <span className="badge bg-white text-gray-700">
                  {tasks[column.id]?.length || 0}
                </span>
              </div>

              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-3 min-h-[400px]"
                  >
                    {tasks[column.id]?.map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => setSelectedTask(task)}
                            className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-gray-900 flex-1">
                                {task.title}
                              </h4>
                              <button className="p-1">
                                <MoreVertical className="h-4 w-4 text-gray-400" />
                              </button>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {task.description || 'No description'}
                            </p>
                            
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`badge text-xs ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <span>{task.assignedTo?.name || 'Unassigned'}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(task.deadline).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    
                    {tasks[column.id]?.length === 0 && (
                      <div className="text-center py-8 text-gray-500 text-sm">
                        No tasks in {column.title}
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchTasks}
        projectId={projectId}
      />

      <TaskDetailsModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdate={fetchTasks}
      />
    </div>
  );
}

