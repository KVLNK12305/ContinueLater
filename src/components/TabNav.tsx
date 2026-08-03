import React from 'react';
import { LayoutDashboard, Clock, BarChart3, Settings, Sparkles } from 'lucide-react';

export type TabView = 'home' | 'timeline' | 'insights' | 'settings' | 'ai';

interface TabNavProps {
  activeTab: TabView;
  onTabChange: (tab: TabView) => void;
}

export const TabNav: React.FC<TabNavProps> = ({ activeTab, onTabChange }) => {
  const tabs: { key: TabView; label: string; icon: React.ReactNode }[] = [
    { key: 'home', label: 'Home', icon: <LayoutDashboard size={16} /> },
    { key: 'timeline', label: 'Timeline', icon: <Clock size={16} /> },
    { key: 'insights', label: 'Insights', icon: <BarChart3 size={16} /> },
    { key: 'settings', label: 'Settings', icon: <Settings size={16} /> },
    { key: 'ai', label: 'AI', icon: <Sparkles size={16} /> }
  ];

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '6px 4px',
        backgroundColor: 'var(--md-sys-color-surface)',
        borderTop: '1px solid var(--md-sys-color-outline-variant)',
        zIndex: 100
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
              gap: '2px',
              padding: '4px 10px',
              borderRadius: 'var(--radius-md)',
              color: isActive ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-on-surface-variant)',
              backgroundColor: isActive ? 'var(--md-sys-color-primary-container)' : 'transparent',
              transition: 'all 0.15s ease'
            }}
          >
            {tab.icon}
            <span style={{ fontSize: '10px', fontWeight: isActive ? 600 : 400 }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
