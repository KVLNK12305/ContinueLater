import { describe, it, expect, beforeEach } from 'vitest';
import { buildResumeUrl, safeUrlId, generateMarkdownDigest } from '../src/utils/resume';
import { meetsEngagementThreshold } from '../src/content/detector';
import { LearningObject } from '../src/types/learning-object';

const store: Record<string, string> = {};
const mockLocalStorage = {
  getItem: (key: string) => store[key] || null,
  setItem: (key: string, value: string) => { store[key] = value; },
  removeItem: (key: string) => { delete store[key]; },
  clear: () => {
    for (const key of Object.keys(store)) {
      delete store[key];
    }
  },
  key: (index: number) => Object.keys(store)[index] || null,
  get length() { return Object.keys(store).length; }
};

if (typeof global !== 'undefined') {
  Object.defineProperty(global, 'localStorage', {
    value: mockLocalStorage,
    writable: true
  });
}
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true
  });
}

describe('Learning Continuity Engine', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });
  const baseItem: LearningObject = {
    id: 'test_item_1',
    type: 'watching',
    title: 'Transformer Models Explained',
    subtitle: '3Blue1Brown',
    url: 'https://www.youtube.com/watch?v=aircAruvnKk',
    thumbnail: 'https://img.youtube.com/vi/aircAruvnKk/hqdefault.jpg',
    resumePoint: { timestamp: 345 },
    completionPercent: 45,
    estimatedRemainingMinutes: 12,
    firstSeen: Date.now() - 600000,
    lastSeen: Date.now(),
    source: 'youtube',
    tags: ['AI', 'Deep Learning'],
    favicon: '',
    readingProgress: 0,
    watchProgress: 45,
    status: 'unfinished',
    metadata: { channel: '3Blue1Brown' },
    schemaVersion: 2
  };

  it('builds enriched YouTube resume URL with exact timestamp', () => {
    const resumeUrl = buildResumeUrl(baseItem);
    expect(resumeUrl).toContain('t=345s');
    expect(resumeUrl).toContain('https://www.youtube.com/watch');
  });

  it('builds enriched Web/Article resume URL with scroll position hash', () => {
    const articleItem: LearningObject = {
      ...baseItem,
      source: 'medium',
      type: 'articles',
      url: 'https://medium.com/@author/deep-dive-into-raft-consensus',
      resumePoint: { scrollPercent: 62 }
    };
    const resumeUrl = buildResumeUrl(articleItem);
    expect(resumeUrl).toContain('#cl-resume=62');
  });

  it('safely handles non-ASCII and international Unicode URLs in safeUrlId without crashing', () => {
    const unicodeUrls = [
      'https://ja.wikipedia.org/wiki/人工知能',
      'https://ru.wikipedia.org/wiki/Компьютер',
      'https://fr.wikipedia.org/wiki/Café',
      'https://example.com/search?q=🚀learning&tag=café'
    ];

    unicodeUrls.forEach((url) => {
      expect(() => {
        const id = safeUrlId(url);
        expect(id).toMatch(/^item_[a-zA-Z0-9_-]+/);
      }).not.toThrow();
    });
  });

  it('validates engagement thresholds correctly for real-world learning flows', () => {
    // 20s active reading even at 2% scroll should be captured
    expect(meetsEngagementThreshold(20, 2)).toBe(true);
    // Skimmed 10% in 8s should be captured
    expect(meetsEngagementThreshold(8, 10)).toBe(true);
    // Brief glance (<5s and 0% progress) should be discarded as bounce
    expect(meetsEngagementThreshold(2, 0)).toBe(false);
  });

  it('generates markdown digest table formatted for Notion and Obsidian', () => {
    const digest = generateMarkdownDigest([baseItem]);
    expect(digest).toContain('# 📚 ContinueLater — Learning Continuity Digest');
    expect(digest).toContain('| YOUTUBE | Transformer Models Explained | 45% | 12 min |');
    expect(digest).toContain('https://www.youtube.com/watch?v=aircAruvnKk&t=345s');
  });

  it('correctly handles reminder cancellation via never option in AlarmManager', async () => {
    const { AlarmManager } = await import('../src/background/alarm-manager');
    const { LearningStore } = await import('../src/storage/learning-store');

    await LearningStore.save({ ...baseItem, status: 'snoozed', scheduledTime: Date.now() + 3600000 });
    let saved = await LearningStore.getById(baseItem.id);
    expect(saved?.status).toBe('snoozed');
    expect(saved?.scheduledTime).toBeDefined();

    // Scheduling with 'never' must clear scheduledTime and return status to unfinished
    await AlarmManager.scheduleReminder(baseItem.id, 'never');
    saved = await LearningStore.getById(baseItem.id);
    expect(saved?.status).toBe('unfinished');
    expect(saved?.scheduledTime).toBeUndefined();
  });
});
