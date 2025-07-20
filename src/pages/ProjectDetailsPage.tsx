import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProjects } from '../contexts/ProjectContext';
import { Plus, Calendar, CheckCircle, Circle, Edit, Trash2, ArrowLeft, AlertTriangle } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { Task } from '../types';

const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { projects, tasks, loading, error, fetchTasks, updateTask, deleteTask } = useProjects();
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  

  const project = tasks.find(p => p.projectId._id === id);
  

  useEffect(() => {
    if (id) {
      fetchTasks(id);
    }
  }, [id]);

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    await updateTask(taskId, { completed });
  };

  const handleDeleteTask = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(project._id);
      setSelectedTask(project._id);
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  console.log("hereeee",project);
  

  if (!project) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Project not found</h3>
        <Link to="/dashboard" className="text-blue-600 hover:text-blue-500">
          Back to Dashboard
        </Link>
      </div>
    );
  }

const completedTasks = tasks.filter(task => task.status === "done").length;

  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </Link>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
            <p className="text-gray-600 mb-4">{project.description}</p>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Created {formatDate(project.createdAt)}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                project.status === 'todo' ? 'bg-green-100 text-green-800' :
                project.status === 'done' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {project.status}
              </span>
            </div>
          </div>
          
          <Link
            to={`/projects/${project.projectId._id}/edit`}
            className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Project</span>
          </Link>
        </div>
      </div>

      {/* Progress Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Progress</h2>
          <span className="text-sm text-gray-600">
            {completedTasks} of {totalTasks} tasks completed
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        <p className="text-sm text-gray-600">{Math.round(progressPercentage)}% complete</p>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
            <Link
              to={`/projects/${project.projectId._id}/tasks/new`}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </Link>
          </div>
        </div>

        <div className="p-6">
          {tasks.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
              <p className="text-gray-600 mb-6">Start by adding your first task</p>
              <Link
                to={`/projects/${project.projectId._id}/tasks/new`}
                className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Task</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <button
                      onClick={() => handleToggleTask(task._id, !task.status === "done")}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      {task.status === "done" ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                    
                    <div className="flex-1">
                      <h3 className={`font-medium ${task.status === "done" ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className={`text-sm mt-1 ${task.status === "done" ? 'text-gray-400' : 'text-gray-600'}`}>
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.status)}`}>
                          {task.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(task.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <button
                      onClick={() => setSelectedTask(selectedTask === task.id ? null : task.id)}
                      className="p-1 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      <Edit className="w-4 h-4 text-gray-500" />
                    </button>
                    
                    {selectedTask === task.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                        <Link
                          to={`/projects/${project.projectId._id}/tasks/${project._id}/edit`}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setSelectedTask(null)}
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </Link>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;