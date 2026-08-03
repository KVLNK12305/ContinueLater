import React from 'react';
import { ALL_BADGES } from '../utils/badges';
import { BookOpen, GraduationCap, Headphones, Code, Flame, Zap, Award } from 'lucide-react';

interface BadgeGridProps {
  unlockedBadgeIds: string[];
}

export const BadgeGrid: React.FC<BadgeGridProps> = ({ unlockedBadgeIds }) => {
  const renderIcon = (iconName: string, isUnlocked: boolean) => {
    const props = {
      size: 26,
      color: isUnlocked ? '#2a2212' : 'var(--md-sys-color-on-surface-variant)'
    };

    let iconNode;
    switch (iconName) {
      case 'BookOpen': iconNode = <BookOpen {...props} />; break;
      case 'GraduationCap': iconNode = <GraduationCap {...props} />; break;
      case 'Headphones': iconNode = <Headphones {...props} />; break;
      case 'Code': iconNode = <Code {...props} />; break;
      case 'Flame': iconNode = <Flame {...props} />; break;
      case 'Zap': iconNode = <Zap {...props} />; break;
      default: iconNode = <Award {...props} />; break;
    }

    return (
      <div style={{
        filter: isUnlocked ? 'drop-shadow(1px 2px 2px rgba(0,0,0,0.4))' : 'none'
      }}>
        {iconNode}
      </div>
    );
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '14px'
      }}
    >
      {ALL_BADGES.map((badge) => {
        const isUnlocked = unlockedBadgeIds.includes(badge.id);

        return (
          <div
            key={badge.id}
            className={`painted-card ${isUnlocked ? 'painted-interactive' : ''}`}
            style={{
              padding: '16px 8px',
              backgroundColor: isUnlocked ? 'var(--color-moon-yellow)' : 'var(--color-surface)',
              border: isUnlocked ? '2px solid #a54619' : '2px solid var(--color-sky-swirl)',
              opacity: isUnlocked ? 1 : 0.6,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '10px'
            }}
          >
            {renderIcon(badge.icon, isUnlocked)}
            <span className="display-font" style={{ fontSize: '13px', fontWeight: 800, color: isUnlocked ? '#2a2212' : 'var(--md-sys-color-on-surface)' }}>
              {badge.name}
            </span>
            <span style={{ fontSize: '10px', color: isUnlocked ? 'rgba(42,34,18,0.8)' : 'var(--md-sys-color-on-surface-variant)', lineHeight: 1.3 }}>
              {badge.description}
            </span>
          </div>
        );
      })}
    </div>
  );
};
