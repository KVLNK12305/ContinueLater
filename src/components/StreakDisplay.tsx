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
        padding: '6px 12px',
        borderRadius: 'var(--radius-full)',
        backgroundColor: 'var(--md-sys-color-surface-variant)',
        border: '1px solid var(--md-sys-color-outline-variant)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <Flame size={16} className="animate-flame" color="#f97316" fill="#f97316" />
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--md-sys-color-on-surface)' }}>
          {streak} {streak === 1 ? 'day' : 'days'}
        </span>
      </div>

      <div style={{ width: '1px', height: '12px', backgroundColor: 'var(--md-sys-color-outline)' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--md-sys-color-primary)' }}>
          Lvl {level}
        </span>
        <span style={{ fontSize: '10px', color: 'var(--md-sys-color-on-surface-variant)' }}>
          ({xp} XP)
        </span>
      </div>
    </div>
  );
};
