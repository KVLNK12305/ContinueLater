import { LearningSource, ExtractedLearningData } from './types';

export const MediumParser: LearningSource = {
  name: 'medium',
  urlPatterns: [/^https:\/\/(www\.)?medium\.com\//, /^https:\/\/[a-zA-Z0-9-]+\.medium\.com\//],

  detect(url: string): boolean {
    return this.urlPatterns.some((pattern) => pattern.test(url)) || document.querySelector('meta[property="al:ios:app_name"][content="Medium"]') !== null;
  },

  parse(doc: Document, url: string, extraData?: Record<string, any>): ExtractedLearningData {
    const headlineEl = doc.querySelector('h1, meta[property="og:title"]');
    const headline = headlineEl ? (headlineEl.getAttribute('content') || headlineEl.textContent || '').trim() : doc.title;

    const authorEl = doc.querySelector('meta[name="author"], a[data-action="show-user-card"], [data-testid="authorName"]');
    const author = authorEl ? (authorEl.getAttribute('content') || authorEl.textContent || '').trim() : 'Medium Author';

    const readingTimeEl = doc.querySelector('[data-testid="storyReadTime"]');
    let estReadingMinutes = 5;
    if (readingTimeEl?.textContent) {
      const match = readingTimeEl.textContent.match(/(\d+)\s*min/);
      if (match) estReadingMinutes = parseInt(match[1], 10);
    } else {
      const articleText = doc.querySelector('article, main')?.textContent || '';
      estReadingMinutes = Math.max(1, Math.ceil(articleText.split(/\s+/).length / 225));
    }

    const scrollPercent = extraData?.scrollPercent || 0;
    const remainingMinutes = Math.max(0, Math.ceil(estReadingMinutes * (1 - scrollPercent / 100)));

    const imageEl = doc.querySelector('meta[property="og:image"]');
    const thumbnail = imageEl ? imageEl.getAttribute('content') || '' : '';

    return {
      title: headline || 'Medium Article',
      subtitle: `By ${author}`,
      url,
      thumbnail,
      type: 'articles',
      source: 'medium',
      favicon: 'https://medium.com/favicon.ico',
      tags: ['Medium', 'Article', author].filter(Boolean),
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
