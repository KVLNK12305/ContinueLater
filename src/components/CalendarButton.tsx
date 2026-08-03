import React from 'react';
import { LearningObject } from '../types/learning-object';
import { generateGoogleCalendarUrl } from '../utils/calendar';
import { Calendar } from 'lucide-react';

interface CalendarButtonProps {
  item: LearningObject;
}

export const CalendarButton: React.FC<CalendarButtonProps> = ({ item }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = generateGoogleCalendarUrl(item);
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.create({ url });
    } else {
      window.open(url, '_blank');
    }
  };

  return (
    <button
      onClick={handleClick}
      title="Add to Google Calendar"
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
      <Calendar size={12} />
      <span>Calendar</span>
    </button>
  );
};
