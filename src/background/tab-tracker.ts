import { LearningStore } from '../storage/learning-store';
import { StatsStore } from '../storage/stats-store';
import { LearningObject } from '../types/learning-object';
import { getParserForUrl } from '../parsers/registry';
import { isSessionCompleted, meetsEngagementThreshold } from '../content/detector';

const COOLDOWNS_KEY = 'continue_later_url_cooldowns';
const COOLDOWN_MS = 30 * 60 * 1000; // 30-minute cooldown window

export class TabTracker {
  private activeTabSessions: Map<number, { url: string; startTime: number; lastItem?: LearningObject; isEngaged: boolean }> = new Map();

  private async getCooldowns(): Promise<Record<string, number>> {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      return new Promise((resolve) => {
        chrome.storage.local.get([COOLDOWNS_KEY], (res) => {
          resolve(res[COOLDOWNS_KEY] || {});
        });
      });
    }
    const raw = localStorage.getItem(COOLDOWNS_KEY);
    return raw ? JSON.parse(raw) : {};
  }

  private async saveCooldowns(cooldowns: Record<string, number>): Promise<void> {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      return new Promise((resolve) => {
        chrome.storage.local.set({ [COOLDOWNS_KEY]: cooldowns }, () => resolve());
      });
    }
    localStorage.setItem(COOLDOWNS_KEY, JSON.stringify(cooldowns));
  }

  public handleProgressUpdate(
    tabId: number,
    updateData: any,
    isFinal: boolean
  ): void {
    if (!updateData || !updateData.data) return;

    const data = updateData.data;
    const parser = getParserForUrl(data.url);
    const timeSpent = updateData.data.timeSpent || updateData.timeSpent || 0;
    const progress = data.completionPercent || 0;

    const isEngaged = meetsEngagementThreshold(timeSpent, progress);

    LearningStore.getByUrl(data.url).then(async (existing) => {
      // 1. False-positive session capture: Discard silently if below threshold and doesn't already exist
      if (!isEngaged && !existing) {
        return;
      }

      const itemId = `item_${btoa(data.url).substring(0, 32).replace(/[^a-zA-Z0-9]/g, '')}`;
      const now = Date.now();
      const firstSeen = existing ? existing.firstSeen : now;
      const status: LearningObject['status'] = isSessionCompleted(data.completionPercent, parser)
        ? 'completed'
        : 'unfinished';

      const learningItem: LearningObject = {
        id: existing ? existing.id : itemId,
        type: data.type,
        title: data.title,
        subtitle: data.subtitle,
        url: data.url,
        thumbnail: data.thumbnail || (existing ? existing.thumbnail : ''),
        resumePoint: data.resumePoint,
        completionPercent: data.completionPercent,
        estimatedRemainingMinutes: data.estimatedRemainingMinutes,
        firstSeen,
        lastSeen: now,
        source: data.source,
        tags: data.tags || [],
        favicon: data.favicon,
        readingProgress: data.type !== 'watching' ? data.completionPercent : 0,
        watchProgress: data.type === 'watching' ? data.completionPercent : 0,
        status,
        metadata: data.metadata || {},
        schemaVersion: 2
      };

      // Persist item
      LearningStore.save(learningItem);

      // Track active session for tab
      if (tabId) {
        this.activeTabSessions.set(tabId, {
          url: data.url,
          startTime: firstSeen,
          lastItem: learningItem,
          isEngaged
        });
      }

      // Deduplicate "start" activity recording with a persistent 30-minute cooldown
      if (isEngaged) {
        const cooldowns = await this.getCooldowns();
        const lastStart = cooldowns[data.url];
        if (!lastStart || now - lastStart > COOLDOWN_MS) {
          cooldowns[data.url] = now;
          await this.saveCooldowns(cooldowns);
          StatsStore.recordActivity('start', 0, data.tags?.[0] || '');
        }
      }

      // Record statistics if completed
      if (status === 'completed' && existing?.status !== 'completed') {
        StatsStore.recordActivity('finish', data.estimatedRemainingMinutes || 5, data.tags?.[0] || '');
      }
    });
  }

  public handleTabRemoved(tabId: number): void {
    const session = this.activeTabSessions.get(tabId);
    // Only record abandon if the user actively engaged (met the threshold) before closing
    if (session && session.isEngaged && session.lastItem) {
      if (session.lastItem.status === 'unfinished') {
        StatsStore.recordActivity('abandon', 0, session.lastItem.tags?.[0] || '');
      }
    }
    this.activeTabSessions.delete(tabId);
  }
}
