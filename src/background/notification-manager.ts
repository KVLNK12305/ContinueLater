import { LearningObject } from '../types/learning-object';
import { formatRemainingTime } from '../utils/time';
import { LearningStore } from '../storage/learning-store';
import { StatsStore } from '../storage/stats-store';
import { buildResumeUrl } from '../utils/resume';

export class NotificationManager {
  public static async showUnfinishedNotification(item: LearningObject): Promise<void> {
    if (typeof chrome === 'undefined' || !chrome.notifications) return;

    const notificationId = `notify_${item.id}`;
    const remainingStr = formatRemainingTime(item.estimatedRemainingMinutes);

    // Chrome notifications require an extension package path for iconUrl. Remote URLs are rejected.
    const iconUrl = 'icons/icon128.png';

    chrome.notifications.create(notificationId, {
      type: 'basic',
      iconUrl,
      title: 'You never finished',
      message: `${item.title}\n${remainingStr}`,
      contextMessage: item.subtitle || 'ContinueLater Learning Continuity',
      buttons: [
        { title: '▶ Resume' },
        { title: '⏰ Snooze 1hr' }
      ],
      priority: 2
    });
  }

  public static handleNotificationButtonClicked(notificationId: string, buttonIndex: number): void {
    if (!notificationId.startsWith('notify_')) return;
    const itemId = notificationId.replace('notify_', '');

    LearningStore.getById(itemId).then((item) => {
      if (!item) return;

      if (buttonIndex === 0) {
        // Resume button: open tab & record recovery stat
        const resumeUrl = buildResumeUrl(item);
        if (typeof chrome !== 'undefined' && chrome.tabs) {
          chrome.tabs.create({ url: resumeUrl });
        }
        StatsStore.recordActivity('recover', 0, item.tags?.[0] || '');
        LearningStore.updateStatus(itemId, 'active');
      } else if (buttonIndex === 1) {
        // Snooze 1 hour
        if (typeof chrome !== 'undefined' && chrome.alarms) {
          chrome.alarms.create(`reminder_${item.id}`, { delayInMinutes: 60 });
        }
        LearningStore.updateStatus(itemId, 'snoozed', Date.now() + 3600000);
      }

      chrome.notifications.clear(notificationId);
    });
  }

  public static handleNotificationClicked(notificationId: string): void {
    if (!notificationId.startsWith('notify_')) return;
    const itemId = notificationId.replace('notify_', '');

    LearningStore.getById(itemId).then((item) => {
      if (item && typeof chrome !== 'undefined' && chrome.tabs) {
        const resumeUrl = buildResumeUrl(item);
        chrome.tabs.create({ url: resumeUrl });
        StatsStore.recordActivity('recover', 0, item.tags?.[0] || '');
      }
      chrome.notifications.clear(notificationId);
    });
  }
}
