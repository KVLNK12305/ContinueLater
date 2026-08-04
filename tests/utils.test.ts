import { describe, it, expect } from 'vitest';
import { generateGoogleCalendarUrl } from '../src/utils/calendar';
import { generateMailtoUrl } from '../src/utils/email';
import { formatRemainingTime } from '../src/utils/time';
import { filterAndSearchLearningItems } from '../src/utils/search';
import { LearningObject } from '../src/types/learning-object';

describe('Utility Functions', () => {
  const mockItem: LearningObject = {
    id: 'test_1',
    type: 'watching',
    title: 'Building AI Agents with LangChain',
    subtitle: 'FreeCodeCamp',
    url: 'https://www.youtube.com/watch?v=mock123',
    thumbnail: 'https://img.youtube.com/vi/mock123/hqdefault.jpg',
    resumePoint: { timestamp: 600 },
    completionPercent: 30,
    estimatedRemainingMinutes: 25,
    firstSeen: Date.now() - 3600000,
    lastSeen: Date.now(),
    source: 'youtube',
    tags: ['AI', 'LangChain'],
    favicon: '',
    readingProgress: 0,
    watchProgress: 30,
    status: 'unfinished',
    metadata: { channel: 'FreeCodeCamp' },
    schemaVersion: 2
  };

  it('formats remaining time correctly', () => {
    expect(formatRemainingTime(0)).toBe('Almost done');
    expect(formatRemainingTime(15)).toBe('15 min remaining');
    expect(formatRemainingTime(60)).toBe('1 hr remaining');
    expect(formatRemainingTime(95)).toBe('1h 35m remaining');
  });

  it('generates valid Google Calendar creation URL', () => {
    const url = generateGoogleCalendarUrl(mockItem, 30);
    expect(url).toContain('https://calendar.google.com/calendar/render?action=TEMPLATE');
    expect(url).toContain('Building+AI+Agents+with+LangChain');
    expect(url).toContain('https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Dmock123');
  });

  it('generates valid Mailto URL', () => {
    const url = generateMailtoUrl(mockItem);
    expect(url).toContain('mailto:?');
    expect(url).toContain('Continue+learning');
    expect(url).toContain('Building+AI+Agents+with+LangChain');
  });

  it('filters items by search query', () => {
    const items = [mockItem];
    const match = filterAndSearchLearningItems(items, {
      category: 'all',
      searchQuery: 'LangChain',
      sortBy: 'lastSeen',
      sortOrder: 'desc'
    });
    expect(match.length).toBe(1);

    const noMatch = filterAndSearchLearningItems(items, {
      category: 'all',
      searchQuery: 'NonExistentTopic',
      sortBy: 'lastSeen',
      sortOrder: 'desc'
    });
    expect(noMatch.length).toBe(0);
  });
});
