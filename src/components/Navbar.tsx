import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import GlobalSearch from './GlobalSearch';
import NotificationDropdown from './NotificationDropdown';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center">
            <AlertCircle className="h-8 w-8 mr-2" />
            <span className="font-bold text-xl">Incident Manager</span>
          </Link>
          <div className="flex-1 max-w-xl px-4">
            <GlobalSearch />
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="hover:bg-blue-700 px-3 py-2 rounded-md">Dashboard</Link>
            <Link to="/cases" className="hover:bg-blue-700 px-3 py-2 rounded-md">Cases</Link>
            {user.role === 'admin' && (
              <Link to="/users" className="hover:bg-blue-700 px-3 py-2 rounded-md">Users</Link>
            )}
            <NotificationDropdown />
            <button
              onClick={handleLogout}
              className="flex items-center hover:bg-blue-700 px-3 py-2 rounded-md"
            >
              <LogOut className="mr-2" size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;