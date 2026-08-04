import React from 'react';
import { LayoutDashboard, Clock, BarChart3, Settings, Sparkles } from 'lucide-react';

export type TabView = 'home' | 'timeline' | 'insights' | 'settings' | 'ai';

interface TabNavProps {
  activeTab: TabView;
  onTabChange: (tab: TabView) => void;
}

export const TabNav: React.FC<TabNavProps> = ({ activeTab, onTabChange }) => {
  const tabs: { key: TabView; label: string; icon: React.ReactNode }[] = [
    { key: 'home', label: 'Home', icon: <LayoutDashboard size={18} /> },
    { key: 'timeline', label: 'Timeline', icon: <Clock size={18} /> },
    { key: 'insights', label: 'Insights', icon: <BarChart3 size={18} /> },
    { key: 'settings', label: 'Settings', icon: <Settings size={18} /> },
    { key: 'ai', label: 'AI', icon: <Sparkles size={18} /> }
  ];

  return (
    <div style={{ padding: '4px 10px 10px 10px', background: 'var(--nm-bg)' }}>
      <nav
        className="nm-card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '6px 8px',
          zIndex: 100,
          borderRadius: 'var(--nm-radius-lg)'
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                borderRadius: 'var(--nm-radius-md)',
                color: isActive ? 'var(--nm-accent)' : 'var(--nm-text-secondary)',
                background: 'transparent',
                boxShadow: isActive 
                  ? 'inset 2.5px 2.5px 5px var(--nm-shadow-dark), inset -2.5px -2.5px 5px var(--nm-shadow-light)'
                  : 'none',
                transition: 'all 0.2s ease',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {tab.icon}
              </div>
              <span style={{ 
                fontSize: '10px', 
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--nm-accent)' : 'inherit'
              }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
export default TabNav;
