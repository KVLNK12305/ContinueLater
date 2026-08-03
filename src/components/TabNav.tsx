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
    <div style={{ padding: '4px 10px 10px 10px' }}>
      <nav
        className="painted-card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '6px 8px',
          zIndex: 100
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className="painted-interactive"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-lg)',
                color: isActive ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-on-surface-variant)',
                background: isActive ? 'rgba(252, 217, 85, 0.1)' : 'transparent',
                boxShadow: isActive ? 'var(--shadow-impasto-base)' : 'none',
              }}
            >
              <div style={{ 
                filter: isActive ? 'drop-shadow(0 0 6px var(--color-moon-glow))' : 'none'
              }}>
                {tab.icon}
              </div>
              <span className="display-font" style={{ 
                fontSize: '11px', 
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--md-sys-color-primary)' : 'inherit'
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
