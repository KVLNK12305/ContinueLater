import React from 'react';
import { Target } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <Target size={36} color="var(--nm-accent)" />,
  title,
  description
}) => {
  return (
    <div
      className="nm-card animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '36px 20px',
        textAlign: 'center',
        gap: '16px',
        margin: '12px 0'
      }}
    >
      <div 
        style={{ 
          padding: '16px', 
          borderRadius: '50%', 
          background: 'var(--nm-bg)',
          boxShadow: 'inset 3px 3px 6px var(--nm-shadow-dark), inset -3px -3px 6px var(--nm-shadow-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {icon}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3 className="display-font" style={{ fontSize: '18px', fontWeight: 800, color: 'var(--nm-text-primary)' }}>
          {title}
        </h3>
        <p style={{ fontSize: '12px', color: 'var(--nm-text-secondary)', maxWidth: '260px', lineHeight: 1.5 }}>
          {description}
        </p>
      </div>
    </div>
  );
};
