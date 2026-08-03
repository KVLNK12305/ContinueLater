import { ScheduleOption } from '../types/enums';

export function formatRemainingTime(minutes: number): string {
  if (minutes <= 0) return 'Almost done';
  if (minutes < 60) return `${minutes} min remaining`;
  const hours = Math.floor(minutes / 60);
  const remMinutes = minutes % 60;
  if (remMinutes === 0) return `${hours} hr remaining`;
  return `${hours}h ${remMinutes}m remaining`;
}

export function formatRelativeDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();
  if (isToday) return 'Today';

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
  if (diffDays < 7) return 'Last Week';
  if (diffDays < 30) return 'Last Month';

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function calculateScheduleTimestamp(option: ScheduleOption, customDate?: Date): number | undefined {
  const now = new Date();

  switch (option) {
    case 'tomorrow': {
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      return tomorrow.getTime();
    }
    case 'after_lunch': {
      const lunch = new Date(now);
      if (now.getHours() >= 14) lunch.setDate(now.getDate() + 1);
      lunch.setHours(14, 0, 0, 0); // 2:00 PM
      return lunch.getTime();
    }
    case 'this_evening': {
      const evening = new Date(now);
      if (now.getHours() >= 19) evening.setDate(now.getDate() + 1);
      evening.setHours(19, 0, 0, 0); // 7:00 PM
      return evening.getTime();
    }
    case 'weekend': {
      const weekend = new Date(now);
      const day = now.getDay();
      const dist = (6 - day + 7) % 7 || 7; // Next Saturday
      weekend.setDate(now.getDate() + dist);
      weekend.setHours(10, 0, 0, 0);
      return weekend.getTime();
    }
    case 'next_monday': {
      const monday = new Date(now);
      const day = now.getDay();
      const dist = (1 - day + 7) % 7 || 7; // Next Monday
      monday.setDate(now.getDate() + dist);
      monday.setHours(9, 0, 0, 0);
      return monday.getTime();
    }
    case 'custom':
      return customDate ? customDate.getTime() : undefined;
    case 'never':
    default:
      return undefined;
  }
}
