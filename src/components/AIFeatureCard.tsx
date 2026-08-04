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
  badgeText = 'Coming soon',
  previewSnippet
}) => {
  return (
    <div
      className="nm-card"
      style={{
        padding: '18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        position: 'relative',
        opacity: 0.6,
        pointerEvents: 'none', // Disable all interactions and clicks
        userSelect: 'none'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Sparkles size={18} color="var(--nm-text-secondary)" />
          </div>
          <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--nm-text-primary)' }}>
            {title}
          </h4>
        </div>
        <span
          style={{
            fontSize: '9px',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: 'var(--nm-radius-sm)',
            backgroundColor: 'var(--nm-shadow-dark)',
            color: 'var(--nm-text-secondary)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Lock size={10} /> {badgeText}
        </span>
      </div>

      <p style={{ fontSize: '12px', color: 'var(--nm-text-secondary)', lineHeight: 1.5 }}>
        {description}
      </p>

      {previewSnippet && (
        <div
          style={{
            padding: '10px 12px',
            borderRadius: 'var(--nm-radius-sm)',
            backgroundColor: 'var(--nm-bg)',
            boxShadow: 'inset 2px 2px 4px var(--nm-shadow-dark), inset -2px -2px 4px var(--nm-shadow-light)',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--nm-text-secondary)',
            border: '1px solid rgba(255, 255, 255, 0.02)'
          }}
        >
          {previewSnippet}
        </div>
      )}
    </div>
  );
};
