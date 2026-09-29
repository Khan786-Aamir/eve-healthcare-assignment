import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Activity, User, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Activity className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-gray-900 tracking-tight">EVE <span className="text-primary">Health</span></span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-primary flex items-center gap-1 font-medium transition-colors">
                  <LayoutDashboard className="h-5 w-5" /> Dashboard
                </Link>
                <Link to="/profile" className="text-gray-600 hover:text-primary flex items-center gap-1 font-medium transition-colors">
                  <User className="h-5 w-5" /> Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary font-medium transition-colors">Login</Link>
                <Link to="/signup" className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;