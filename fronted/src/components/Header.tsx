import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/95 backdrop-blur-sm shadow-xl border-b border-gray-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center">
                <span className="text-gray-200 font-bold text-lg">🌍</span>
              </div>
              <h1 className="text-xl font-bold text-gray-100">
                Flight Booking
              </h1>
            </div>
          </div>
          <nav className="flex space-x-1">
            <a 
              href="#" 
              className="bg-slate-700 text-gray-100 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-600 transition-colors"
            >
              Flights
            </a>
            <a 
              href="#" 
              className="text-gray-300 hover:text-gray-100 hover:bg-slate-800 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            >
              My Bookings
            </a>
            <a 
              href="#" 
              className="text-gray-300 hover:text-gray-100 hover:bg-slate-800 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            >
              Profile
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;