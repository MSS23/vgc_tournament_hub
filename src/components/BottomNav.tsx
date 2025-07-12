import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface BottomNavProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <nav className="bottom-nav">
      <div className="flex justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`nav-item ${isActive ? 'active' : ''}`}
              aria-label={tab.label}
            >
              <Icon className="nav-icon" />
              <span className="nav-label text-ellipsis">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;