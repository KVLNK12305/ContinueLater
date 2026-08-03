import React from 'react';
import { LearningObject } from '../types/learning-object';
import { generateMailtoUrl } from '../utils/email';
import { Mail } from 'lucide-react';

interface EmailButtonProps {
  item: LearningObject;
}

export const EmailButton: React.FC<EmailButtonProps> = ({ item }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = generateMailtoUrl(item);
    window.open(url, '_self');
  };

  return (
    <button
      onClick={handleClick}
      title="Email yourself this link"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '11px',
        padding: '4px 8px',
        borderRadius: 'var(--radius-sm)',
        backgroundColor: 'var(--md-sys-color-surface-variant)',
        color: 'var(--md-sys-color-on-surface-variant)',
        border: '1px solid var(--md-sys-color-outline-variant)'
      }}
    >
      <Mail size={12} />
      <span>Email</span>
    </button>
  );
};
