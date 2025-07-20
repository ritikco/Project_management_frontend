// // Demo data initialization for the project management application
// // This file populates localStorage with sample data if it doesn't already exist

// // Check if demo data already exists
// if (!localStorage.getItem('demoDataInitialized')) {
//   // Demo user data
//   const demoUsers = [
//     {
//       id: 'demo-user-1',
//       email: 'demo@example.com',
//       password: 'password123',
//       name: 'Demo User',
//       createdAt: new Date('2024-01-01').toISOString(),
//     },
//     {
//       id: 'demo-user-2',
//       email: 'john@example.com',
//       password: 'password123',
//       name: 'John Smith',
//       createdAt: new Date('2024-01-02').toISOString(),
//     }
//   ];

//   // Demo projects data
//   const demoProjects = [
//     {
//       id: 'project-1',
//       name: 'Website Redesign',
//       description: 'Complete redesign of the company website with modern UI/UX principles and responsive design.',
//       userId: 'demo-user-1',
//       status: 'active',
//       createdAt: new Date('2024-01-15').toISOString(),
//       updatedAt: new Date('2024-01-20').toISOString(),
//     },
//     {
//       id: 'project-2',
//       name: 'Mobile App Development',
//       description: 'Develop a cross-platform mobile application for iOS and Android using React Native.',
//       userId: 'demo-user-1',
//       status: 'active',
//       createdAt: new Date('2024-01-10').toISOString(),
//       updatedAt: new Date('2024-01-18').toISOString(),
//     },
//     {
//       id: 'project-3',
//       name: 'Database Migration',
//       description: 'Migrate legacy database to modern cloud infrastructure with improved performance and security.',
//       userId: 'demo-user-1',
//       status: 'completed',
//       createdAt: new Date('2024-01-05').toISOString(),
//       updatedAt: new Date('2024-01-25').toISOString(),
//     }
//   ];

//   // Demo tasks data
//   const demoTasks = [
//     // Website Redesign tasks
//     {
//       id: 'task-1',
//       title: 'Create wireframes and mockups',
//       description: 'Design initial wireframes and high-fidelity mockups for all main pages.',
//       projectId: 'project-1',
//       completed: true,
//       priority: 'high',
//       createdAt: new Date('2024-01-15').toISOString(),
//       updatedAt: new Date('2024-01-17').toISOString(),
//     },
//     {
//       id: 'task-2',
//       title: 'Implement responsive navigation',
//       description: 'Build a responsive navigation component that works across all device sizes.',
//       projectId: 'project-1',
//       completed: true,
//       priority: 'medium',
//       createdAt: new Date('2024-01-16').toISOString(),
//       updatedAt: new Date('2024-01-19').toISOString(),
//     },
//     {
//       id: 'task-3',
//       title: 'Optimize images and assets',
//       description: 'Compress and optimize all images and static assets for better performance.',
//       projectId: 'project-1',
//       completed: false,
//       priority: 'medium',
//       createdAt: new Date('2024-01-18').toISOString(),
//       updatedAt: new Date('2024-01-18').toISOString(),
//     },
//     {
//       id: 'task-4',
//       title: 'Implement contact form',
//       description: 'Create a functional contact form with validation and email integration.',
//       projectId: 'project-1',
//       completed: false,
//       priority: 'low',
//       createdAt: new Date('2024-01-20').toISOString(),
//       updatedAt: new Date('2024-01-20').toISOString(),
//     },

//     // Mobile App Development tasks
//     {
//       id: 'task-5',
//       title: 'Set up development environment',
//       description: 'Configure React Native development environment and project structure.',
//       projectId: 'project-2',
//       completed: true,
//       priority: 'high',
//       createdAt: new Date('2024-01-10').toISOString(),
//       updatedAt: new Date('2024-01-12').toISOString(),
//     },
//     {
//       id: 'task-6',
//       title: 'Design app architecture',
//       description: 'Plan the overall app architecture, state management, and navigation structure.',
//       projectId: 'project-2',
//       completed: true,
//       priority: 'high',
//       createdAt: new Date('2024-01-11').toISOString(),
//       updatedAt: new Date('2024-01-14').toISOString(),
//     },
//     {
//       id: 'task-7',
//       title: 'Implement user authentication',
//       description: 'Build login, registration, and password recovery functionality.',
//       projectId: 'project-2',
//       completed: false,
//       priority: 'high',
//       createdAt: new Date('2024-01-15').toISOString(),
//       updatedAt: new Date('2024-01-15').toISOString(),
//     },
//     {
//       id: 'task-8',
//       title: 'Create main dashboard',
//       description: 'Develop the main dashboard with user statistics and quick actions.',
//       projectId: 'project-2',
//       completed: false,
//       priority: 'medium',
//       createdAt: new Date('2024-01-16').toISOString(),
//       updatedAt: new Date('2024-01-16').toISOString(),
//     },

//     // Database Migration tasks
//     {
//       id: 'task-9',
//       title: 'Analyze current database schema',
//       description: 'Document and analyze the existing database structure and dependencies.',
//       projectId: 'project-3',
//       completed: true,
//       priority: 'high',
//       createdAt: new Date('2024-01-05').toISOString(),
//       updatedAt: new Date('2024-01-08').toISOString(),
//     },
//     {
//       id: 'task-10',
//       title: 'Set up cloud infrastructure',
//       description: 'Configure cloud database instance with proper security and backup settings.',
//       projectId: 'project-3',
//       completed: true,
//       priority: 'high',
//       createdAt: new Date('2024-01-08').toISOString(),
//       updatedAt: new Date('2024-01-12').toISOString(),
//     },
//     {
//       id: 'task-11',
//       title: 'Migrate data',
//       description: 'Execute the data migration process with validation and rollback procedures.',
//       projectId: 'project-3',
//       completed: true,
//       priority: 'high',
//       createdAt: new Date('2024-01-12').toISOString(),
//       updatedAt: new Date('2024-01-20').toISOString(),
//     },
//     {
//       id: 'task-12',
//       title: 'Update application connections',
//       description: 'Update all application connection strings and test functionality.',
//       projectId: 'project-3',
//       completed: true,
//       priority: 'medium',
//       createdAt: new Date('2024-01-20').toISOString(),
//       updatedAt: new Date('2024-01-25').toISOString(),
//     }
//   ];

//   // Initialize localStorage with demo data
//   localStorage.setItem('users', JSON.stringify(demoUsers));
//   localStorage.setItem('projects', JSON.stringify(demoProjects));
//   localStorage.setItem('tasks', JSON.stringify(demoTasks));
//   localStorage.setItem('demoDataInitialized', 'true');

//   console.log('Demo data initialized successfully!');
// } else {
//   console.log('Demo data already exists in localStorage');
// }