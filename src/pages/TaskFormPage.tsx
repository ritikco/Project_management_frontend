import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useProjects } from '../contexts/ProjectContext';
import { Save, ArrowLeft, AlertCircle } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { Task } from '../types';

const TaskFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { projectId, taskId } = useParams<{ projectId: string; taskId?: string }>();
  const { projects, tasks, fetchTasks , createTask, updateTask, loading } = useProjects();
  
  const isEditing = Boolean(taskId);
  const project = tasks.find(p => p.projectId._id === projectId);
  const task = isEditing ? tasks.find(t => t._id === taskId) : null;

  console.log("hellooo",tasks);
  

const [formData, setFormData] = useState({
  title: '',
  description: '',
  status: '',
  dueDate: new Date().toISOString().split('T')[0], 
  projectId: projectId || '',
});

  const [error, setError] = useState('');

  useEffect(() => {
  if (projectId) {
    fetchTasks(projectId);
  }
}, [projectId]);


  useEffect(() => {
    if (isEditing && task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        dueDate: task.dueDate,
        projectId : task.projectId
      });
    }
  }, [isEditing, task]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData(prev => ({
      ...prev,
      [e.target.name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Task title is required');
      return;
    }

    if (!projectId) {
      setError('Project ID is required');
      return;
    }

    try {
      if (isEditing && taskId) {
        await updateTask(taskId, formData);
      } else {
        await createTask({
          ...formData,
          projectId,
        });
      }
      navigate(`/projects/${projectId}`);
    } catch (err) {
      setError('Failed to save task');
      console.error('Save task error:', err);
    }
  };

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Project not found</p>
        <Link to="/dashboard" className="text-blue-600 hover:text-blue-500 mt-4 inline-block">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (isEditing && !task) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Task not found</p>
        <Link to={`/projects/${projectId}`} className="text-blue-600 hover:text-blue-500 mt-4 inline-block">
          Back to Project
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          to={`/projects/${projectId}`}
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {project.title}</span>
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? 'Edit Task' : 'Create New Task'}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center space-x-2 text-red-700">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Task Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter task title"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe the task..."
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todo">Todo</option>
              <option value="inProgress">InProgress</option>
              <option value="done">Complete</option>
            </select>
          </div>

          {isEditing && (
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <Link
              to={`/projects/${projectId}`}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </Link>
            
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <LoadingSpinner size="small" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEditing ? 'Update Task' : 'Create Task'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormPage;