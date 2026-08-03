import React from 'react';
import { Target, Search } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <Target size={32} color="var(--md-sys-color-primary)" />,
  title,
  description
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        textAlign: 'center',
        gap: '10px'
      }}
    >
      <div>{icon}</div>
      <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--md-sys-color-on-surface)' }}>
        {title}
      </h3>
      <p style={{ fontSize: '12px', color: 'var(--md-sys-color-on-surface-variant)', maxWidth: '240px', lineHeight: 1.4 }}>
        {description}
      </p>
    </div>
  );
};
