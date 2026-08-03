import { LearningSource, ExtractedLearningData } from './types';

export const GoogleSearchParser: LearningSource = {
  name: 'google-search',
  urlPatterns: [/^https:\/\/(www\.)?google\.[a-z.]+\/search/],

  detect(url: string): boolean {
    return this.urlPatterns.some((pattern) => pattern.test(url));
  },

  parse(doc: Document, url: string, extraData?: Record<string, any>): ExtractedLearningData {
    const urlObj = new URL(url);
    const searchQuery = urlObj.searchParams.get('q') || '';

    // Result items visible on screen
    const resultTitles: string[] = [];
    doc.querySelectorAll('div.g h3, div[data-attrid] h3').forEach((el) => {
      const txt = el.textContent?.trim();
      if (txt) resultTitles.push(txt);
    });

    const scrollPercent = extraData?.scrollPercent || 0;
    const timeSpentSeconds = extraData?.timeSpent || 0;

    return {
      title: searchQuery ? `Search: "${searchQuery}"` : 'Google Search',
      subtitle: `${resultTitles.length} results found`,
      url,
      thumbnail: '',
      type: 'research',
      source: 'google-search',
      favicon: 'https://www.google.com/favicon.ico',
      tags: ['Google Search', 'Research', searchQuery].filter(Boolean),
      resumePoint: {
        query: searchQuery,
        scrollPercent
      },
      completionPercent: Math.min(100, scrollPercent),
      estimatedRemainingMinutes: Math.max(1, Math.ceil((100 - scrollPercent) / 25)),
      metadata: {
        searchQuery,
        visitedResults: resultTitles.slice(0, 5)
      }
    };
  },

  getCompletionThreshold(): number {
    return 90;
  }
};
