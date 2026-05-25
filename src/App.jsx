import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import Navbar from './components/common/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfileSetup from './pages/ProfileSetup';
import Dashboard from './pages/Dashboard';
import CreateProject from './pages/CreateProject';
import Discover from './pages/Discover';
import ProjectDetail from './pages/ProjectDetail';

// Route Guard for authenticated actions
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="h-8 w-8 border-4 border-indigo-500/20 border-t-indigo-650 rounded-full animate-spin"></span>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Route Guard to prevent logged-in users from seeing visitor forms
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="h-8 w-8 border-4 border-indigo-500/20 border-t-indigo-650 rounded-full animate-spin"></span>
      </div>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  const { loadUser } = useAuthStore();

  // Try to rehydrate user credentials on initialization
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* Public landing */}
            <Route path="/" element={<LandingPage />} />

            {/* Auth routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            {/* Protected dashboard and wizard paths */}
            <Route
              path="/setup"
              element={
                <ProtectedRoute>
                  <ProfileSetup />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/create"
              element={
                <ProtectedRoute>
                  <CreateProject />
                </ProtectedRoute>
              }
            />
            <Route
              path="/discover"
              element={
                <ProtectedRoute>
                  <Discover />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:id"
              element={
                <ProtectedRoute>
                  <ProjectDetail />
                </ProtectedRoute>
              }
            />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
