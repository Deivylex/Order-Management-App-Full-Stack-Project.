import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;
  
  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };
  return (
    <header className="bg-gray-900/95 backdrop-blur-sm shadow-xl border-b border-gray-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center">
                <span className="text-gray-200 font-bold text-lg">🌍</span>
              </div>
              <h1 className="text-xl font-bold text-gray-100">
                Booking System
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => navigate('/flights')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/flights') || isActive('/')
                  ? 'bg-slate-700 text-gray-100' 
                  : 'text-gray-300 hover:text-gray-100 hover:bg-slate-800'
              }`}
            >
              Setting
            </button>
            <button
              onClick={() => navigate('/my-bookings')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/my-bookings')
                  ? 'bg-slate-700 text-gray-100'
                  : 'text-gray-300 hover:text-gray-100 hover:bg-slate-800'
              }`}
            >
              My orders
            </button>
            
            {user?.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/admin')
                    ? 'bg-slate-700 text-gray-100'
                    : 'text-gray-300 hover:text-gray-100 hover:bg-slate-800'
                }`}
              >
                Admin Panel
              </button>
            )}
            <button
              onClick={() => navigate('/profile')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/profile')
                  ? 'bg-slate-700 text-gray-100'
                  : 'text-gray-300 hover:text-gray-100 hover:bg-slate-800'
              }`}
            >
              Profile
            </button>
            
            {/* Desktop User info and logout */}
            <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-600">
              <span className="text-gray-300 text-sm">
                Welcome, {user?.name}
              </span>
              <button
                onClick={logout}
                className="flex items-center space-x-2 text-gray-300 hover:text-red-400 hover:bg-red-900/20 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                title="Logout"
              >
                <FiLogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-gray-100 p-2"
            >
              {isMobileMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700/50">
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => handleNavigate('/flights')}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${
                  isActive('/flights') || isActive('/')
                    ? 'bg-slate-700 text-gray-100' 
                    : 'text-gray-300 hover:text-gray-100 hover:bg-slate-800'
                }`}
              >
                Setting
              </button>
              <button
                onClick={() => handleNavigate('/my-bookings')}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${
                  isActive('/my-bookings')
                    ? 'bg-slate-700 text-gray-100'
                    : 'text-gray-300 hover:text-gray-100 hover:bg-slate-800'
                }`}
              >
                My orders
              </button>
              
              {user?.role === 'admin' && (
                <button
                  onClick={() => handleNavigate('/admin')}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${
                    isActive('/admin')
                      ? 'bg-slate-700 text-gray-100'
                      : 'text-gray-300 hover:text-gray-100 hover:bg-slate-800'
                  }`}
                >
                  Admin Panel
                </button>
              )}
              
              <button
                onClick={() => handleNavigate('/profile')}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${
                  isActive('/profile')
                    ? 'bg-slate-700 text-gray-100'
                    : 'text-gray-300 hover:text-gray-100 hover:bg-slate-800'
                }`}
              >
                Profile
              </button>
              
              {/* Mobile User info and logout */}
              <div className="pt-4 mt-4 border-t border-gray-700/50">
                <div className="px-4 py-2">
                  <span className="text-gray-300 text-sm">
                    Welcome, {user?.name}
                  </span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-2 text-gray-300 hover:text-red-400 hover:bg-red-900/20 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left"
                >
                  <FiLogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;