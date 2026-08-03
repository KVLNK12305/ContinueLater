import { LearningStore } from '../storage/learning-store';
import { StatsStore } from '../storage/stats-store';
import { LearningObject } from '../types/learning-object';
import { generateId } from '../utils/id';
import { getParserForUrl } from '../parsers/registry';
import { isSessionUnfinished, isSessionCompleted } from '../content/detector';

export class TabTracker {
  private activeTabSessions: Map<number, { url: string; startTime: number; lastItem?: LearningObject }> = new Map();

  public handleProgressUpdate(
    tabId: number,
    updateData: any,
    isFinal: boolean
  ): void {
    if (!updateData || !updateData.data) return;

    const data = updateData.data;
    const parser = getParserForUrl(data.url);

    // Filter noise: Ignore if user spent < 5 seconds and 0% progress
    if (data.completionPercent <= 0 && data.resumePoint?.timestamp === 0) {
      return;
    }

    const itemId = `item_${btoa(data.url).substring(0, 32).replace(/[^a-zA-Z0-9]/g, '')}`;

    LearningStore.getByUrl(data.url).then((existing) => {
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
        metadata: data.metadata || {}
      };

      // Persist item
      LearningStore.save(learningItem);

      // Track active session for tab
      if (tabId) {
        this.activeTabSessions.set(tabId, {
          url: data.url,
          startTime: firstSeen,
          lastItem: learningItem
        });
      }

      // Record statistics if completed
      if (status === 'completed' && existing?.status !== 'completed') {
        StatsStore.recordActivity('finish', data.estimatedRemainingMinutes || 5, data.tags?.[0] || '');
      }
    });
  }

  public handleTabRemoved(tabId: number): void {
    const session = this.activeTabSessions.get(tabId);
    if (session && session.lastItem) {
      if (session.lastItem.status === 'unfinished') {
        StatsStore.recordActivity('abandon', 0, session.lastItem.tags?.[0] || '');
      }
    }
    this.activeTabSessions.delete(tabId);
  }
}
