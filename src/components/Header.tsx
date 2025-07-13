import React from 'react';
import { Trophy, Bell, Shield, Settings, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { UserSession } from '../types';

interface HeaderProps {
  userSession: UserSession;
  onSettings?: () => void;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ userSession, onSettings, onLogout }) => {
  const { t } = useTranslation();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm w-full">
      <div className="flex flex-wrap items-center justify-between px-2 sm:px-4 py-2 sm:py-2.5 md:py-3 min-h-[56px] max-w-full overflow-x-auto">
        <div className="flex items-center space-x-2 min-w-0">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg flex-shrink-0">
            <Trophy className="h-6 w-6 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 truncate max-w-[160px] sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg">
              {t('app.title', 'VGC Hub')}
            </h1>
            <p className="text-xs sm:text-sm text-gray-700 truncate max-w-[120px] sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg">
              {t('app.subtitle', 'Tournament Platform')}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors" aria-label="Admin Panel">
            <Shield className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors" aria-label="Settings" onClick={onSettings}>
            <Settings className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-600 hover:text-red-600 transition-colors" aria-label="Logout" onClick={onLogout}>
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;