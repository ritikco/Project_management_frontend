import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProjectProvider } from './contexts/ProjectContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import ProjectFormPage from './pages/ProjectFormPage';
import TaskFormPage from './pages/TaskFormPage';

function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="projects/new" element={<ProjectFormPage />} />
              <Route path="projects/:id" element={<ProjectDetailsPage />} />
              <Route path="projects/:id/edit" element={<ProjectFormPage />} />
              <Route path="projects/:projectId/tasks/new" element={<TaskFormPage />} />
              <Route path="projects/:projectId/tasks/:taskId/edit" element={<TaskFormPage />} />
            </Route>
          </Routes>
        </Router>
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;