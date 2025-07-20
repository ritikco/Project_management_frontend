import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '../contexts/ProjectContext';
import { Plus, FolderOpen, Calendar, MoreVertical, Edit, Trash2 } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { Project } from '../types';

const DashboardPage: React.FC = () => {
  const { projects, loading, error, fetchProjects, deleteProject } = useProjects();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project? This will also delete all associated tasks.')) {
      await deleteProject(projectId);
      setSelectedProject(null);
    }
  };

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800';
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
 
  if (loading && projects.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
          <p className="text-gray-600 mt-2">Manage and track your projects</p>
        </div>
        
        <Link
          to="/projects/new"
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first project</p>
          <Link
            to="/projects/new"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Project</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(projects) && projects.map((project) => (
            <div
              key={project._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <Link 
                    to={`/projects/${project._id}`}
                    className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    {project.title}
                  </Link>
                  
                  <div className="relative">
                    <button
                      onClick={() => setSelectedProject(selectedProject === project._id ? null : project._id)}
                      className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                    
                    {selectedProject === project._id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                        <Link
                          to={`/projects/${project._id}/edit`}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setSelectedProject(project._id)}
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </Link>
                        <button
                          onClick={() => handleDeleteProject(project._id)}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(project.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;