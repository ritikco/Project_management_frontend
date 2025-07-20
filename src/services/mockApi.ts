import { User, Project, Task } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Mock API using localStorage for persistence
class MockAPI {
  private getFromStorage<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private saveToStorage<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Auth methods
  async login(email: string, password: string): Promise<{ user: User; token: string } | null> {
    await this.delay(800); // Simulate network delay
    
    const users = this.getFromStorage<User & { password: string }>('users');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      const token = this.generateJWTToken(userWithoutPassword);
      return { user: userWithoutPassword, token };
    }
    
    return null;
  }

  async register(email: string, password: string, name: string): Promise<{ user: User; token: string }> {
    await this.delay(800);
    
    const users = this.getFromStorage<User & { password: string }>('users');
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      throw new Error('User already exists');
    }
    
    const newUser = {
      id: uuidv4(),
      email,
      password,
      name,
      createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    this.saveToStorage('users', users);
    
    const { password: _, ...userWithoutPassword } = newUser;
    const token = this.generateJWTToken(userWithoutPassword);
    
    return { user: userWithoutPassword, token };
  }

  // Project methods
  async getProjects(userId: string): Promise<Project[]> {
    await this.delay(500);
    const projects = this.getFromStorage<Project>('projects');
    return projects.filter(p => p.userId === userId);
  }

  async createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    await this.delay(500);
    
    const projects = this.getFromStorage<Project>('projects');
    const newProject: Project = {
      ...project,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    projects.push(newProject);
    this.saveToStorage('projects', projects);
    
    return newProject;
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    await this.delay(500);
    
    const projects = this.getFromStorage<Project>('projects');
    const index = projects.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error('Project not found');
    }
    
    projects[index] = {
      ...projects[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    this.saveToStorage('projects', projects);
    return projects[index];
  }

  async deleteProject(id: string): Promise<void> {
    await this.delay(500);
    
    const projects = this.getFromStorage<Project>('projects');
    const filteredProjects = projects.filter(p => p.id !== id);
    this.saveToStorage('projects', filteredProjects);
    
    // Also delete related tasks
    const tasks = this.getFromStorage<Task>('tasks');
    const filteredTasks = tasks.filter(t => t.projectId !== id);
    this.saveToStorage('tasks', filteredTasks);
  }

  // Task methods
  async getTasks(projectId: string): Promise<Task[]> {
    await this.delay(500);
    const tasks = this.getFromStorage<Task>('tasks');
    return tasks.filter(t => t.projectId === projectId);
  }

  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    await this.delay(500);
    
    const tasks = this.getFromStorage<Task>('tasks');
    const newTask: Task = {
      ...task,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    tasks.push(newTask);
    this.saveToStorage('tasks', tasks);
    
    return newTask;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    await this.delay(500);
    
    const tasks = this.getFromStorage<Task>('tasks');
    const index = tasks.findIndex(t => t.id === id);
    
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    tasks[index] = {
      ...tasks[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    this.saveToStorage('tasks', tasks);
    return tasks[index];
  }

  async deleteTask(id: string): Promise<void> {
    await this.delay(500);
    
    const tasks = this.getFromStorage<Task>('tasks');
    const filteredTasks = tasks.filter(t => t.id !== id);
    this.saveToStorage('tasks', filteredTasks);
  }

  private generateJWTToken(user: User): string {
    // Mock JWT token generation
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ 
      userId: user.id, 
      email: user.email,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    }));
    const signature = 'mock-signature';
    
    return `${header}.${payload}.${signature}`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const mockApi = new MockAPI();