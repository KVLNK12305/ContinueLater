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
      className="nm-btn nm-btn-secondary"
      style={{ fontSize: '11px', padding: '4px 10px' }}
    >
      <Calendar size={12} /> Calendar
    </button>
  );
};
