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
      className="painted-btn painted-btn-secondary painted-interactive"
      style={{ fontSize: '11px', padding: '4px 10px' }}
    >
      <Mail size={12} /> Email
    </button>
  );
};
