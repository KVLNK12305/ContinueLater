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
        <h2 className="display-font" style={{ fontSize: '20px', fontWeight: 800, color: 'var(--md-sys-color-on-surface)' }}>
          Smart Insights
        </h2>
        <p style={{ fontSize: '11px', color: 'var(--md-sys-color-on-surface-variant)', fontStyle: 'italic' }}>
          Track your learning velocity and unlock achievement badges
        </p>
      </div>

      {/* Grid of Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        <div className="painted-card painted-card-interactive animate-fade-in" style={statCardStyle}>
          <span style={{ fontSize: '11px', color: 'var(--md-sys-color-on-surface-variant)', fontWeight: 600 }}>Started Sessions</span>
          <span className="display-font" style={{ fontSize: '24px', fontWeight: 800, color: 'var(--md-sys-color-on-surface)' }}>{stats.sessionsStarted}</span>
        </div>
        <div className="painted-card painted-card-interactive animate-fade-in" style={{...statCardStyle, animationDelay: '0.05s'}}>
          <span style={{ fontSize: '11px', color: 'var(--md-sys-color-on-surface-variant)', fontWeight: 600 }}>Finished</span>
          <span className="display-font painted-text-accent" style={{ fontSize: '24px', fontWeight: 800 }}>{stats.sessionsFinished}</span>
        </div>
        <div className="painted-card painted-card-interactive animate-fade-in" style={{...statCardStyle, animationDelay: '0.1s'}}>
          <span style={{ fontSize: '11px', color: 'var(--md-sys-color-on-surface-variant)', fontWeight: 600 }}>Recovered</span>
          <span className="display-font painted-text-accent" style={{ fontSize: '24px', fontWeight: 800 }}>{stats.sessionsRecovered}</span>
        </div>
        <div className="painted-card painted-card-interactive animate-fade-in" style={{...statCardStyle, animationDelay: '0.15s'}}>
          <span style={{ fontSize: '11px', color: 'var(--md-sys-color-on-surface-variant)', fontWeight: 600 }}>Learning Hours</span>
          <span className="display-font" style={{ fontSize: '24px', fontWeight: 800, color: 'var(--md-sys-color-success)' }}>{learningHours}h</span>
        </div>
      </div>

      {/* Analytics Summary */}
      <div
        className="painted-card painted-card-interactive animate-fade-in"
        style={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          animationDelay: '0.2s'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
          <span style={{ color: 'var(--md-sys-color-on-surface-variant)', fontWeight: 600 }}>Consistency Score</span>
          <span className="painted-text-accent display-font" style={{ fontWeight: 800, fontSize: '16px' }}>{consistencyPercent}%</span>
        </div>
        
        {/* Painted Progress Bar */}
        <div style={{ width: '100%', height: '14px', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 'var(--radius-full)', overflow: 'hidden', boxShadow: 'inset 1px 2px 4px rgba(0,0,0,0.8)' }}>
          <div style={{ width: `${consistencyPercent}%`, height: '100%', background: 'var(--gradient-accent)', borderRadius: 'var(--radius-full)', boxShadow: 'var(--shadow-impasto-base)' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', paddingTop: '6px' }}>
          <span style={{ color: 'var(--md-sys-color-on-surface-variant)', fontWeight: 500 }}>Longest Streak</span>
          <span className="painted-text-accent display-font" style={{ fontWeight: 800 }}>{stats.longestStreak} days</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
          <span style={{ color: 'var(--md-sys-color-on-surface-variant)', fontWeight: 500 }}>Most Visited Topic</span>
          <span style={{ fontWeight: 700 }}>{topTopic}</span>
        </div>
      </div>

      {/* Badges Section */}
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '10px', animationDelay: '0.25s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="painted-glow" style={{ display: 'flex', alignItems: 'center' }}>
            <Award size={18} color="var(--color-moon-yellow)" />
          </div>
          <h3 className="display-font" style={{ fontSize: '18px', fontWeight: 800 }}>Achievement Badges</h3>
        </div>
        <BadgeGrid unlockedBadgeIds={stats.unlockedBadges} />
      </div>
    </div>
  );
};

const statCardStyle: React.CSSProperties = {
  padding: '16px 14px',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
};
