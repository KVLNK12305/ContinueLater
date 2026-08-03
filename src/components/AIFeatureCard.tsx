import React from 'react';
import { Lock, Sparkles } from 'lucide-react';

interface AIFeatureCardProps {
  title: string;
  description: string;
  badgeText?: string;
  previewSnippet?: string;
}

export const AIFeatureCard: React.FC<AIFeatureCardProps> = ({
  title,
  description,
  badgeText = 'Future AI Feature',
  previewSnippet
}) => {
  return (
    <div
      style={{
        padding: '14px',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--md-sys-color-surface-variant)',
        border: '1px solid var(--md-sys-color-outline-variant)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={16} color="var(--md-sys-color-primary)" />
          <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--md-sys-color-on-surface)' }}>
            {title}
          </h4>
        </div>
        <span
          style={{
            fontSize: '9px',
            fontWeight: 700,
            padding: '2px 6px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--md-sys-color-primary-container)',
            color: 'var(--md-sys-color-on-primary-container)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px'
          }}
        >
          <Lock size={8} /> {badgeText}
        </span>
      </div>

      <p style={{ fontSize: '11px', color: 'var(--md-sys-color-on-surface-variant)', lineHeight: 1.4 }}>
        {description}
      </p>

      {previewSnippet && (
        <div
          style={{
            padding: '8px 10px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--md-sys-color-surface)',
            border: '1px stroke var(--md-sys-color-outline-variant)',
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--md-sys-color-primary)',
            opacity: 0.9
          }}
        >
          {previewSnippet}
        </div>
      )}
    </div>
  );
};
