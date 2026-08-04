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
      color: isUnlocked ? 'var(--nm-accent)' : 'var(--nm-text-secondary)'
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
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {iconNode}
      </div>
    );
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px'
      }}
    >
      {ALL_BADGES.map((badge) => {
        const isUnlocked = unlockedBadgeIds.includes(badge.id);

        return (
          <div
            key={badge.id}
            className={`nm-card ${isUnlocked ? 'nm-pop-in' : ''}`}
            style={{
              padding: '16px 8px',
              backgroundColor: 'var(--nm-bg)',
              boxShadow: isUnlocked 
                ? '6px 6px 12px var(--nm-shadow-dark), -6px -6px 12px var(--nm-shadow-light)'
                : 'inset 3px 3px 6px var(--nm-shadow-dark), inset -3px -3px 6px var(--nm-shadow-light)',
              border: isUnlocked ? '2px solid var(--nm-accent)' : '1px solid transparent',
              opacity: isUnlocked ? 1 : 0.55,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '8px',
              transition: 'all 0.3s ease'
            }}
          >
            {renderIcon(badge.icon, isUnlocked)}
            <span style={{ 
              fontSize: '11px', 
              fontWeight: 700, 
              color: isUnlocked ? 'var(--nm-text-primary)' : 'var(--nm-text-secondary)',
              marginTop: '4px'
            }}>
              {badge.name}
            </span>
            <span style={{ 
              fontSize: '9px', 
              color: 'var(--nm-text-secondary)', 
              lineHeight: 1.3 
            }}>
              {badge.description}
            </span>
          </div>
        );
      })}
    </div>
  );
};
