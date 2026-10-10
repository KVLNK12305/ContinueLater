import { ScheduleOption } from './enums';

export interface ThresholdConfig {
  youtube: number; // e.g. 90%
  article: number; // e.g. 95%
  pdf: number; // e.g. 95%
  github: number; // e.g. 95%
  doc: number; // e.g. 95%
  default: number; // e.g. 90%
}

export interface UserSettings {
  defaultReminderSchedule: ScheduleOption;
  idleTimeoutMinutes: number; // X minutes of inactivity
  thresholds: ThresholdConfig;
  theme: 'retro' | 'light' | 'dark' | 'system';
  enableNotifications: boolean;
  enableSound: boolean;
  weeklyGoalHours: number;
  // New configuration properties
  autoArchiveDays: number; // e.g. 7 days
  enableAutoArchive: boolean;
  captureOnAnySite: boolean;
}

export const DEFAULT_SETTINGS: UserSettings = {
  defaultReminderSchedule: 'tomorrow',
  idleTimeoutMinutes: 10,
  thresholds: {
    youtube: 90,
    article: 95,
    pdf: 95,
    github: 95,
    doc: 95,
    default: 90
  },
  theme: 'retro',
  enableNotifications: true,
  enableSound: false,
  weeklyGoalHours: 10,
  autoArchiveDays: 7,
  enableAutoArchive: true,
  captureOnAnySite: false
};
