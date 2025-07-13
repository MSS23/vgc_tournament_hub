import React, { useEffect, useState } from 'react';
import { UserSession } from '../types';
import Header from './Header';
import BottomNav from './BottomNav';
import { useTranslation } from 'react-i18next';
import LanguageDropdown from './LanguageDropdown';
import { Trophy, Users, Calendar, Search, BookOpen, Heart, Ticket, HelpCircle } from 'lucide-react';
import Modal from './Modal';

interface AppLayoutProps {
  children: React.ReactNode;
  userSession: UserSession;
  onLogout?: () => void;
  showBottomNav?: boolean;
  tabs?: Array<{ id: string; label: string; icon: any }>;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  userSession, 
  onLogout,
  showBottomNav = false,
  tabs = [],
  activeTab = '',
  onTabChange
}) => {
  const { i18n, t } = useTranslation();
  const [showSettings, setShowSettings] = useState(false);

  // Listen for language changes and force re-render
  useEffect(() => {
    const handleLanguageChange = () => {
      // Force re-render when language changes
      window.dispatchEvent(new Event('resize'));
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

  const handleTabChange = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        userSession={userSession} 
        onSettings={() => setShowSettings(true)} 
        onLogout={onLogout}
      />
      <main className="flex-1 pb-16">
        {children}
      </main>
      {showBottomNav && tabs.length > 0 && (
        <BottomNav 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={handleTabChange} 
        />
      )}
      {/* Settings Modal */}
      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title={t('settings.settings')}
        size="lg"
        className="min-w-[320px] max-w-[95vw]"
        bodyClassName="p-0"
      >
        <div className="divide-y divide-gray-100">
          {/* Language Selection Section */}
          <section className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">{t('settings.languageSection', 'Language')}</h3>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">{t('settings.language')}</span>
              <LanguageDropdown />
            </div>
          </section>
          {/* Placeholder for future settings */}
          <section className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">{t('settings.otherSettings', 'Other Settings')}</h3>
            <div className="text-gray-400 text-sm">{t('settings.comingSoon', 'More settings coming soon...')}</div>
          </section>
        </div>
      </Modal>
    </div>
  );
};

export default AppLayout; 