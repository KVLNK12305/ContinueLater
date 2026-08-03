import React from 'react';
import { useStats } from '../../hooks/useStats';
import { BadgeGrid } from '../../components/BadgeGrid';
import { BarChart3, Award, Flame, Zap, Target } from 'lucide-react';

export const Insights: React.FC = () => {
  const { stats, loading } = useStats();

  const learningHours = (stats.totalLearningMinutes / 60).toFixed(1);
  const consistencyPercent = stats.sessionsStarted > 0
    ? Math.round((stats.sessionsFinished / stats.sessionsStarted) * 100)
    : 100;
  const topTopic = stats.topTopics[0]?.topic || 'AI & Tech';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px', overflowY: 'auto', paddingRight: '2px' }}>
      <div style={{ padding: '0 4px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--md-sys-color-on-surface)' }}>
          Smart Insights & Gamification
        </h2>
        <p style={{ fontSize: '10px', color: 'var(--md-sys-color-on-surface-variant)' }}>
          Track your learning velocity and unlock achievement badges
        </p>
      </div>

      {/* Grid of Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
        <div style={statCardStyle}>
          <span style={{ fontSize: '10px', color: 'var(--md-sys-color-on-surface-variant)' }}>Started Sessions</span>
          <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--md-sys-color-on-surface)' }}>{stats.sessionsStarted}</span>
        </div>
        <div style={statCardStyle}>
          <span style={{ fontSize: '10px', color: 'var(--md-sys-color-on-surface-variant)' }}>Finished</span>
          <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--md-sys-color-success)' }}>{stats.sessionsFinished}</span>
        </div>
        <div style={statCardStyle}>
          <span style={{ fontSize: '10px', color: 'var(--md-sys-color-on-surface-variant)' }}>Recovered Sessions</span>
          <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--md-sys-color-primary)' }}>{stats.sessionsRecovered}</span>
        </div>
        <div style={statCardStyle}>
          <span style={{ fontSize: '10px', color: 'var(--md-sys-color-on-surface-variant)' }}>Learning Hours</span>
          <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--md-sys-color-secondary)' }}>{learningHours}h</span>
        </div>
      </div>

      {/* Analytics Summary */}
      <div
        style={{
          padding: '12px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--md-sys-color-surface-variant)',
          border: '1px solid var(--md-sys-color-outline-variant)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
          <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Consistency Score</span>
          <span style={{ fontWeight: 700, color: 'var(--md-sys-color-primary)' }}>{consistencyPercent}%</span>
        </div>
        <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--md-sys-color-outline)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
          <div style={{ width: `${consistencyPercent}%`, height: '100%', backgroundColor: 'var(--md-sys-color-primary)' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', paddingTop: '4px' }}>
          <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Longest Streak</span>
          <span style={{ fontWeight: 600 }}>{stats.longestStreak} days</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
          <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Most Visited Topic</span>
          <span style={{ fontWeight: 600 }}>{topTopic}</span>
        </div>
      </div>

      {/* Badges Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Award size={16} color="var(--md-sys-color-primary)" />
          <h3 style={{ fontSize: '13px', fontWeight: 600 }}>Achievement Badges</h3>
        </div>
        <BadgeGrid unlockedBadgeIds={stats.unlockedBadges} />
      </div>
    </div>
  );
};

const statCardStyle: React.CSSProperties = {
  padding: '10px 12px',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'var(--md-sys-color-surface-variant)',
  border: '1px solid var(--md-sys-color-outline-variant)',
  display: 'flex',
  flexDirection: 'column',
  gap: '2px'
};
