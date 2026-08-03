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
      className="painted-card painted-interactive"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '6px 16px',
        borderRadius: 'var(--radius-full)',
        border: '1px solid var(--color-moon-glow)',
        background: 'rgba(232, 165, 49, 0.1)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Flame size={16} color="var(--color-moon-yellow)" fill="var(--color-moon-yellow)" style={{ filter: 'drop-shadow(0 0 6px var(--color-moon-glow))' }} />
        <span className="painted-text-accent display-font" style={{ fontSize: '14px', fontWeight: 800 }}>
          {streak} {streak === 1 ? 'day' : 'days'}
        </span>
      </div>

      <div style={{ width: '2px', height: '14px', background: 'var(--gradient-accent)', borderRadius: '2px', opacity: 0.6 }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span className="display-font" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--md-sys-color-on-surface)' }}>
          Lvl {level}
        </span>
        <span style={{ fontSize: '10px', color: 'var(--color-moon-yellow)', fontWeight: 600 }}>
          ({xp} XP)
        </span>
      </div>
    </div>
  );
};
