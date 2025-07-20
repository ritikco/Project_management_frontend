import React, { createContext, useContext, useState } from 'react';
import { ProjectContextType, Project, Task } from '../types';
import { useAuth } from './AuthContext';
import axios from 'axios';

const API_BASE_URL = "https://project-management-9oxy.onrender.com";

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('Usertoken')}`,
  });

const fetchProjects = async () => {
  if (!user) return;

  setLoading(true);
  setError(null);

  try {
    const formData = new FormData();
    formData.append('statusFilter', 'active'); 

    const token = localStorage.getItem("Usertoken");

    const response = await axios.post(
      `${API_BASE_URL}/api/project/get-projects`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );

    console.log(response);
    

    setProjects(response.data.result.projects || []);
  } catch (err) {
    setError('Failed to fetch projects');
    console.error('Fetch projects error:', err);
  } finally {
    setLoading(false);
  }
};


  const fetchTasks = async (projectId: string) => {
    const token = localStorage.getItem("Usertoken");
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/task/get-user-task/${projectId}`,{}, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        // headers: getAuthHeaders(),
      });
      console.log(response.data.result.tasks);
      
      setTasks(response.data.result.tasks || []);
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error('Fetch tasks error:', err);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData: Omit<Project, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/project/create-project`, projectData, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
      });
      setProjects(prev => [...prev, response.data.result]);
    } catch (err) {
      setError('Failed to create project');
      console.error('Create project error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    const token = localStorage.getItem("Usertoken");
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/project/edit-project/${id}`, updates, {
        headers: {
          ...getAuthHeaders(),
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      
      setProjects(prev => prev.map(p => (p.id === id ? response.data.result.project : p)));
    } catch (err) {
      setError('Failed to update project');
      console.error('Update project error:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    const token = localStorage.getItem("Usertoken");
    setLoading(true);
    setError(null);
    try {
    const response =   await axios.post(`${API_BASE_URL}/api/project/change-status-project/${id}`,{status : "delete"}, {
         headers: {
          ...getAuthHeaders(),
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      
      setProjects(prev => prev.filter(p => p.id !== id));
      setTasks(prev => prev.filter(t => t.projectId !== id));
    } catch (err) {
      setError('Failed to delete project');
      console.error('Delete project error:', err);
    } finally {
      setLoading(false);
    }
  };

const createTask = async (taskData: {
  title: string;
  description: string;
  dueDate: string;
  status: string;
  projectId: string;
}) => {
  const token = localStorage.getItem("Usertoken");

  setLoading(true);
  setError(null);

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/task/create-task`,
      taskData,
      {
        headers: {
          ...getAuthHeaders(),
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response);
    
    if (response.data?.result) {
      setTasks((prev) => [...prev, response.data.result]);
    } else {
      console.warn("No result returned in createTask response:", response.data);
    }

  } catch (err) {
      setError('Failed to create task');
      console.error('Create task error:', err);
    } finally {
      setLoading(false);
    }
};


  const updateTask = async (id: string, updates: Partial<Task>) => {
    const token = localStorage.getItem("Usertoken");
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/task/edit-task/${id}`, updates, {
       headers: {
          ...getAuthHeaders(),
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(prev => prev.map(t => (t.id === id ? response.data.result : t)));
    } catch (err) {
      setError('Failed to update task');
      console.error('Update task error:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    console.log("idddd",id);
    
    const token = localStorage.getItem("Usertoken");
    setLoading(true);
    setError(null);
    try {
     const response = await axios.post(`${API_BASE_URL}/api/task/delete-task/${id}`, {} , {
         headers: {
          ...getAuthHeaders(),
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log(response);
      
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError('Failed to delete task');
      console.error('Delete task error:', err);
    } finally {
      setLoading(false);
    }
  };

  const value: ProjectContextType = {
    projects,
    tasks,
    loading,
    error,
    fetchProjects,
    fetchTasks,
    createProject,
    updateProject,
    deleteProject,
    createTask,
    updateTask,
    deleteTask,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};
