import { LearningObject } from '../types/learning-object';
import { formatRemainingTime } from './time';

/**
 * Generates a Google Calendar event creation URL (Zero API cost)
 */
export function generateGoogleCalendarUrl(item: LearningObject, durationMinutes = 30): string {
  const title = `Continue: ${item.title}`;

  const remainingStr = formatRemainingTime(item.estimatedRemainingMinutes);
  const details = `Never lose your learning flow.

Resume session: ${item.url}
Source: ${item.source.toUpperCase()}
Progress: ${item.completionPercent}% completed
Remaining time: ${remainingStr}

Subtitle: ${item.subtitle}
Captured via ContinueLater Chrome Extension.`;

  // Default event start time: Tomorrow at 9:00 AM
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 1);
  startDate.setHours(9, 0, 0, 0);

  const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);

  const formatIsoForGCal = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, '');

  const datesParam = `${formatIsoForGCal(startDate)}/${formatIsoForGCal(endDate)}`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    details: details,
    dates: datesParam
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
