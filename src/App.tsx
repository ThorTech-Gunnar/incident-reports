import React, { lazy, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';

const Login = lazy(() => import('./components/Login'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const CaseList = lazy(() => import('./components/CaseList'));
const CaseDetail = lazy(() => import('./components/CaseDetail'));
const UserManagement = lazy(() => import('./components/UserManagement'));

const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/" replace />;
};

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
            <Route path="/cases" element={<ProtectedRoute element={<CaseList />} />} />
            <Route path="/cases/:id" element={<ProtectedRoute element={<CaseDetail />} />} />
            <Route path="/users" element={<ProtectedRoute element={<UserManagement />} />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}

export default App;