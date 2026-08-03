import React from 'react';
import { Target } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <Target size={36} color="var(--color-moon-yellow)" />,
  title,
  description
}) => {
  return (
    <div
      className="painted-card animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        textAlign: 'center',
        gap: '16px',
        margin: '12px 0'
      }}
    >
      <div 
        className="painted-glow"
        style={{ 
          padding: '16px', 
          borderRadius: 'var(--radius-full)', 
          background: 'rgba(232, 165, 49, 0.2)',
          border: '1px solid var(--color-moon-glow)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {icon}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3 className="display-font painted-text-accent" style={{ fontSize: '20px', fontWeight: 800 }}>
          {title}
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--md-sys-color-on-surface-variant)', maxWidth: '260px', lineHeight: 1.6 }}>
          {description}
        </p>
      </div>
    </div>
  );
};
