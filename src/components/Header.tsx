import React from 'react';
import { Trophy, Bell, Shield } from 'lucide-react';
import LanguageDropdown from './LanguageDropdown';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
            <Trophy className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">VGC Hub</h1>
            <p className="text-xs text-gray-500">Tournament Platform</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <LanguageDropdown />
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Shield className="h-6 w-6 text-gray-600" />
          </button>
          <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Bell className="h-6 w-6 text-gray-600" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;