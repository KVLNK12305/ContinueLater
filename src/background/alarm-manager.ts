import { ScheduleOption } from '../types/enums';
import { calculateScheduleTimestamp } from '../utils/time';
import { LearningStore } from '../storage/learning-store';

export class AlarmManager {
  public static async scheduleReminder(itemId: string, schedule: ScheduleOption, customDate?: Date): Promise<void> {
    const timestamp = calculateScheduleTimestamp(schedule, customDate);
    if (!timestamp) return;

    const alarmName = `reminder_${itemId}`;

    if (typeof chrome !== 'undefined' && chrome.alarms) {
      await chrome.alarms.clear(alarmName);

      const delayInMinutes = Math.max(1, Math.round((timestamp - Date.now()) / (1000 * 60)));

      chrome.alarms.create(alarmName, {
        delayInMinutes
      });
    }

    // Save scheduled time to item status
    await LearningStore.updateStatus(itemId, 'snoozed', timestamp);
  }

  public static async cancelReminder(itemId: string): Promise<void> {
    const alarmName = `reminder_${itemId}`;
    if (typeof chrome !== 'undefined' && chrome.alarms) {
      await chrome.alarms.clear(alarmName);
    }
  }
}
