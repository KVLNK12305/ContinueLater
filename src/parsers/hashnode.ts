import { LearningSource, ExtractedLearningData } from './types';

export const HashnodeParser: LearningSource = {
  name: 'hashnode',
  urlPatterns: [/^https:\/\/[a-zA-Z0-9-]+\.hashnode\.(dev|com)\/[a-zA-Z0-9-]+/],

  detect(url: string): boolean {
    return (
      this.urlPatterns.some((pattern) => pattern.test(url)) ||
      (typeof document !== 'undefined' && document.querySelector('meta[property="og:site_name"][content*="Hashnode"]') !== null)
    );
  },

  parse(doc: Document, url: string, extraData?: Record<string, any>): ExtractedLearningData {
    const headlineEl = doc.querySelector('h1[data-query="post-title"], h1, meta[property="og:title"]');
    const headline = headlineEl ? (headlineEl.getAttribute('content') || headlineEl.textContent || '').trim() : doc.title;

    const authorEl = doc.querySelector('a[aria-label*="author"], meta[name="author"]');
    const author = authorEl ? (authorEl.getAttribute('content') || authorEl.textContent || '').trim() : 'Hashnode Author';

    const articleText = doc.querySelector('article, main')?.textContent || '';
    const estReadingMinutes = Math.max(1, Math.ceil(articleText.split(/\s+/).length / 200));

    const scrollPercent = extraData?.scrollPercent || 0;
    const remainingMinutes = Math.max(0, Math.ceil(estReadingMinutes * (1 - scrollPercent / 100)));

    const imageEl = doc.querySelector('meta[property="og:image"]');
    const thumbnail = imageEl ? imageEl.getAttribute('content') || '' : '';

    return {
      title: headline || 'Hashnode Article',
      subtitle: `By ${author}`,
      url,
      thumbnail,
      type: 'articles',
      source: 'hashnode',
      favicon: 'https://hashnode.com/favicon.ico',
      tags: ['Hashnode', 'Article', author].filter(Boolean),
      resumePoint: {
        scrollPercent
      },
      completionPercent: Math.min(100, scrollPercent),
      estimatedRemainingMinutes: remainingMinutes,
      metadata: {
        headline,
        author
      }
    };
  },

  getCompletionThreshold(): number {
    return 95;
  }
};
