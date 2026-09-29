import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { User, Mail, Shield, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-center sm:text-left flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-blue-200/30">
            <User className="w-12 h-12 text-primary" />
          </div>
          <div className="text-white">
            <h1 className="text-3xl font-bold mb-1">{user.name}</h1>
            <p className="text-blue-100 flex items-center justify-center sm:justify-start">
              <Shield className="w-4 h-4 mr-1" /> Patient Account
            </p>
          </div>
        </div>
        
        <div className="p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Account Details</h2>
          
          <div className="space-y-6">
            <div className="flex items-start pb-4 border-b border-gray-100">
              <User className="w-6 h-6 text-gray-400 mr-4 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p className="text-lg text-gray-900 font-medium">{user.name}</p>
              </div>
            </div>
            
            <div className="flex items-start pb-4 border-b border-gray-100">
              <Mail className="w-6 h-6 text-gray-400 mr-4 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Email Address</p>
                <p className="text-lg text-gray-900 font-medium">{user.email}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-10">
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center w-full sm:w-auto bg-red-50 text-red-600 px-6 py-3 rounded-xl hover:bg-red-100 transition-colors font-bold shadow-sm border border-red-100"
            >
              <LogOut className="w-5 h-5 mr-2" /> Log out of all devices
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;