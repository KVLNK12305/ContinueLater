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
      className="painted-card painted-interactive"
      style={{
        padding: '18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="painted-glow">
            <Sparkles size={20} color="var(--color-moon-yellow)" />
          </div>
          <h4 className="display-font painted-text-accent" style={{ fontSize: '17px', fontWeight: 800 }}>
            {title}
          </h4>
        </div>
        <span
          className="painted-chip"
          style={{
            fontSize: '10px',
            fontWeight: 800,
            padding: '3px 10px',
            backgroundColor: 'rgba(232, 165, 49, 0.2)',
            color: 'var(--color-moon-yellow)',
            border: '1px solid var(--color-moon-yellow)'
          }}
        >
          <Lock size={10} style={{ marginRight: '4px' }} /> {badgeText}
        </span>
      </div>

      <p style={{ fontSize: '12px', color: 'var(--md-sys-color-on-surface-variant)', lineHeight: 1.6 }}>
        {description}
      </p>

      {previewSnippet && (
        <div
          style={{
            padding: '12px 14px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-canvas-bg)',
            boxShadow: 'inset 2px 2px 6px rgba(0,0,0,0.8)',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-moon-yellow)',
            fontWeight: 600,
            border: '1px solid var(--color-sky-swirl)'
          }}
        >
          {previewSnippet}
        </div>
      )}
    </div>
  );
};
