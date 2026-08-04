import { describe, it, expect } from 'vitest';
import { filterAndSearchLearningItems } from '../src/utils/search';
import { LearningObject } from '../src/types/learning-object';

function createMockItem(id: number, title: string, subtitle: string): LearningObject {
  return {
    id: `item_${id}`,
    type: 'reading',
    title,
    subtitle,
    url: `https://example.com/topic-${id}`,
    thumbnail: '',
    resumePoint: {},
    completionPercent: 10,
    estimatedRemainingMinutes: 15,
    firstSeen: Date.now() - id * 1000,
    lastSeen: Date.now() - id * 500,
    source: 'generic',
    tags: [`tag-${id}`, 'learning'],
    favicon: '',
    readingProgress: 10,
    watchProgress: 0,
    status: 'unfinished',
    metadata: {}
  };
}

describe('Fuzzy Search & Filter Performance', () => {
  it('gracefully handles search and sorting over 500+ items', () => {
    const mockItems: LearningObject[] = [];
    
    // Generate 500 mock learning items
    for (let i = 1; i <= 500; i++) {
      mockItems.push(createMockItem(i, `Topic Number ${i} - Learning AI Agents`, `Author-${i}`));
    }

    const startTime = performance.now();

    // Query matching a specific subset (e.g. "Topic Number 1" should match 1, 10-19, 100-199 etc.)
    const results = filterAndSearchLearningItems(mockItems, {
      category: 'all',
      searchQuery: 'Topic Number 10',
      sortBy: 'lastSeen',
      sortOrder: 'desc'
    });

    const endTime = performance.now();
    const duration = endTime - startTime;

    console.log(`Fuzzy search over 500 items completed in ${duration.toFixed(3)} ms`);

    // Verify search matches
    expect(results.length).toBeGreaterThan(0);
    results.forEach(item => {
      const match = item.title.toLowerCase().includes('topic number 10') ||
                    item.subtitle.toLowerCase().includes('topic number 10');
      expect(match).toBe(true);
    });

    // Verify search performance is well under 15ms
    expect(duration).toBeLessThan(15);
  });
});
