import { LearningObject } from '../types/learning-object';
import { formatRemainingTime } from './time';

function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Generates a Google Calendar event creation URL (Zero API cost)
 */
export function generateGoogleCalendarUrl(item: LearningObject, durationMinutes = 30): string {
  const truncatedTitle = truncate(item.title, 120);
  const title = `Continue: ${truncatedTitle}`;

  const remainingStr = formatRemainingTime(item.estimatedRemainingMinutes);
  const detailsRaw = `Never lose your learning flow.

Resume session: ${item.url}
Source: ${item.source.toUpperCase()}
Progress: ${item.completionPercent}% completed
Remaining time: ${remainingStr}

Subtitle: ${item.subtitle}
Captured via ContinueLater Chrome Extension.`;

  const details = truncate(detailsRaw, 1000);

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
