import { LearningSource, ExtractedLearningData } from './types';

export const DevToParser: LearningSource = {
  name: 'devto',
  urlPatterns: [/^https:\/\/(www\.)?dev\.to\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+/],

  detect(url: string): boolean {
    return this.urlPatterns.some((pattern) => pattern.test(url));
  },

  parse(doc: Document, url: string, extraData?: Record<string, any>): ExtractedLearningData {
    const headlineEl = doc.querySelector('#main-title h1, meta[property="og:title"]');
    const headline = headlineEl ? (headlineEl.getAttribute('content') || headlineEl.textContent || '').trim() : doc.title;

    const authorEl = doc.querySelector('.crayons-article__header__meta a.crayons-link--title, meta[name="author"]');
    const author = authorEl ? (authorEl.getAttribute('content') || authorEl.textContent || '').trim() : 'Dev.to Author';

    const articleText = doc.querySelector('#article-body, main')?.textContent || '';
    const wordCount = articleText.split(/\s+/).length;
    const estReadingMinutes = Math.max(1, Math.ceil(wordCount / 200));

    const scrollPercent = extraData?.scrollPercent || 0;
    const remainingMinutes = Math.max(0, Math.ceil(estReadingMinutes * (1 - scrollPercent / 100)));

    const imageEl = doc.querySelector('meta[property="og:image"]');
    const thumbnail = imageEl ? imageEl.getAttribute('content') || '' : '';

    return {
      title: headline || 'Dev.to Article',
      subtitle: `By ${author}`,
      url,
      thumbnail,
      type: 'articles',
      source: 'devto',
      favicon: 'https://dev.to/favicon.ico',
      tags: ['Dev.to', 'Article', author].filter(Boolean),
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
