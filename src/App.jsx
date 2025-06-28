import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProfileSetupPage from './pages/ProfileSetupPage';
import DashboardPage from './pages/DashboardPage';
import { useAuth } from './contexts/UserContext';

function PrivateRoute({ children }) {
  const { user, profileComplete } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!profileComplete) {
    return <Navigate to="/profile-setup" replace />;
  }
  
  return children;
}

function App() {
  return (
    <UserProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile-setup" element={<ProfileSetupPage />} />
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App; 