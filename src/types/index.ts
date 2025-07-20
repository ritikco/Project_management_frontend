export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  token : string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'completed' | 'on-hold';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

export interface ProjectContextType {
  projects: Project[];
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  fetchTasks: (projectId: string) => Promise<void>;
  createProject: (project: Omit<Project, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}