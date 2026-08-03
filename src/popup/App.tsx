import React, { useState, useEffect } from 'react';
import { TabNav, TabView } from '../components/TabNav';
import { Dashboard } from './pages/Dashboard';
import { Timeline } from './pages/Timeline';
import { Insights } from './pages/Insights';
import { SettingsPage } from './pages/Settings';
import { AIPreview } from './pages/AIPreview';
import { useSettings } from '../hooks/useSettings';
import '../styles/global.css';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabView>('home');
  const { settings } = useSettings();

  useEffect(() => {
    // Keyboard navigation within popup
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === '1') setActiveTab('home');
        if (e.key === '2') setActiveTab('timeline');
        if (e.key === '3') setActiveTab('insights');
        if (e.key === '4') setActiveTab('settings');
        if (e.key === '5') setActiveTab('ai');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', backgroundColor: 'var(--md-sys-color-background)' }}>
      {/* Scrollable View Area */}
      <main style={{ flex: 1, padding: '12px 12px 6px 12px', overflow: 'hidden' }}>
        {activeTab === 'home' && <Dashboard />}
        {activeTab === 'timeline' && <Timeline />}
        {activeTab === 'insights' && <Insights />}
        {activeTab === 'settings' && <SettingsPage />}
        {activeTab === 'ai' && <AIPreview />}
      </main>

      {/* Navigation Bar */}
      <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};
