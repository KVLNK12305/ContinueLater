import React from 'react';
import { Flame } from 'lucide-react';

interface StreakDisplayProps {
  streak: number;
  xp: number;
  level: number;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({ streak, xp, level }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '6px 16px',
        borderRadius: '24px',
        background: 'var(--nm-bg)',
        boxShadow: '4px 4px 8px var(--nm-shadow-dark), -4px -4px 8px var(--nm-shadow-light)',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <div className="nm-flame-animated" style={{ display: 'flex', alignItems: 'center' }}>
          <Flame size={16} color="var(--nm-warning)" fill="var(--nm-warning)" />
        </div>
        <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--nm-text-primary)' }}>
          {streak} {streak === 1 ? 'day' : 'days'}
        </span>
      </div>

      <div style={{ width: '1px', height: '14px', background: 'var(--nm-shadow-dark)', opacity: 0.6 }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--nm-text-primary)' }}>
          Lvl {level}
        </span>
        <span style={{ fontSize: '10px', color: 'var(--nm-accent)', fontWeight: 600 }}>
          ({xp} XP)
        </span>
      </div>
    </div>
  );
};
