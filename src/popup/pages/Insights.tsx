import React from 'react';
import { useStats } from '../../hooks/useStats';
import { BadgeGrid } from '../../components/BadgeGrid';
import { Award } from 'lucide-react';

export const Insights: React.FC = () => {
  const { stats, loading } = useStats();

  const learningHours = (stats.totalLearningMinutes / 60).toFixed(1);
  const consistencyPercent = stats.sessionsStarted > 0
    ? Math.round((stats.sessionsFinished / stats.sessionsStarted) * 100)
    : 100;
  const topTopic = stats.topTopics[0]?.topic || 'AI & Tech';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '14px', overflowY: 'auto', paddingRight: '2px' }}>
      <div style={{ padding: '0 4px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--nm-text-primary)' }}>
          Smart Insights
        </h2>
        <p style={{ fontSize: '11px', color: 'var(--nm-text-secondary)', fontStyle: 'italic', marginTop: '2px' }}>
          Track your learning velocity and unlock achievement badges
        </p>
      </div>

      {/* Grid of Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        <div className="nm-card nm-card-interactive animate-fade-in" style={statCardStyle}>
          <span style={{ fontSize: '11px', color: 'var(--nm-text-secondary)', fontWeight: 600 }}>Started Sessions</span>
          <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--nm-text-primary)', marginTop: '4px' }}>{stats.sessionsStarted}</span>
        </div>
        <div className="nm-card nm-card-interactive animate-fade-in" style={{...statCardStyle, animationDelay: '0.05s'}}>
          <span style={{ fontSize: '11px', color: 'var(--nm-text-secondary)', fontWeight: 600 }}>Finished</span>
          <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--nm-accent)', marginTop: '4px' }}>{stats.sessionsFinished}</span>
        </div>
        <div className="nm-card nm-card-interactive animate-fade-in" style={{...statCardStyle, animationDelay: '0.1s'}}>
          <span style={{ fontSize: '11px', color: 'var(--nm-text-secondary)', fontWeight: 600 }}>Recovered</span>
          <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--nm-accent)', marginTop: '4px' }}>{stats.sessionsRecovered}</span>
        </div>
        <div className="nm-card nm-card-interactive animate-fade-in" style={{...statCardStyle, animationDelay: '0.15s'}}>
          <span style={{ fontSize: '11px', color: 'var(--nm-text-secondary)', fontWeight: 600 }}>Learning Hours</span>
          <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--nm-success)', marginTop: '4px' }}>{learningHours}h</span>
        </div>
      </div>

      {/* Analytics Summary */}
      <div
        className="nm-card nm-card-interactive animate-fade-in"
        style={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          animationDelay: '0.2s'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
          <span style={{ color: 'var(--nm-text-secondary)', fontWeight: 600 }}>Consistency Score</span>
          <span style={{ fontWeight: 800, fontSize: '14px', color: 'var(--nm-accent)' }}>{consistencyPercent}%</span>
        </div>
        
        {/* Neumorphic Inset Progress Bar */}
        <div style={{ width: '100%', height: '12px', backgroundColor: 'var(--nm-bg)', borderRadius: '6px', overflow: 'hidden', boxShadow: 'inset 2px 2px 4px var(--nm-shadow-dark), inset -2px -2px 4px var(--nm-shadow-light)', border: '1px solid rgba(255,255,255,0.02)' }}>
          <div style={{ width: `${consistencyPercent}%`, height: '100%', background: 'var(--nm-accent)', borderRadius: '6px' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', paddingTop: '6px' }}>
          <span style={{ color: 'var(--nm-text-secondary)', fontWeight: 500 }}>Longest Streak</span>
          <span style={{ fontWeight: 800, color: 'var(--nm-text-primary)' }}>{stats.longestStreak} days</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
          <span style={{ color: 'var(--nm-text-secondary)', fontWeight: 500 }}>Most Visited Topic</span>
          <span style={{ fontWeight: 700, color: 'var(--nm-text-primary)' }}>{topTopic}</span>
        </div>
      </div>

      {/* Badges Section */}
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '10px', animationDelay: '0.25s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 4px' }}>
          <Award size={18} color="var(--nm-accent)" />
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--nm-text-primary)' }}>Achievement Badges</h3>
        </div>
        <BadgeGrid unlockedBadgeIds={stats.unlockedBadges} />
      </div>
    </div>
  );
};

const statCardStyle: React.CSSProperties = {
  padding: '14px 12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '2px'
};
