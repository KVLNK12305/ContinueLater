import React from 'react';
import { ALL_BADGES } from '../utils/badges';
import { BookOpen, GraduationCap, Headphones, Code, Flame, Zap, Award } from 'lucide-react';

interface BadgeGridProps {
  unlockedBadgeIds: string[];
}

export const BadgeGrid: React.FC<BadgeGridProps> = ({ unlockedBadgeIds }) => {
  const renderIcon = (iconName: string, isUnlocked: boolean) => {
    const props = {
      size: 20,
      color: isUnlocked ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-on-surface-variant)'
    };

    switch (iconName) {
      case 'BookOpen': return <BookOpen {...props} />;
      case 'GraduationCap': return <GraduationCap {...props} />;
      case 'Headphones': return <Headphones {...props} />;
      case 'Code': return <Code {...props} />;
      case 'Flame': return <Flame {...props} />;
      case 'Zap': return <Zap {...props} />;
      default: return <Award {...props} />;
    }
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px'
      }}
    >
      {ALL_BADGES.map((badge) => {
        const isUnlocked = unlockedBadgeIds.includes(badge.id);

        return (
          <div
            key={badge.id}
            style={{
              padding: '10px 8px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: isUnlocked ? 'var(--md-sys-color-primary-container)' : 'var(--md-sys-color-surface-variant)',
              border: '1px solid',
              borderColor: isUnlocked ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline-variant)',
              opacity: isUnlocked ? 1 : 0.45,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '6px'
            }}
          >
            {renderIcon(badge.icon, isUnlocked)}
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--md-sys-color-on-surface)' }}>
              {badge.name}
            </span>
            <span style={{ fontSize: '9px', color: 'var(--md-sys-color-on-surface-variant)', lineHeight: 1.2 }}>
              {badge.description}
            </span>
          </div>
        );
      })}
    </div>
  );
};
