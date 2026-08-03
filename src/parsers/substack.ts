import { LearningSource, ExtractedLearningData } from './types';

export const SubstackParser: LearningSource = {
  name: 'substack',
  urlPatterns: [/^https:\/\/[a-zA-Z0-9-]+\.substack\.com\/(p|p\/[a-zA-Z0-9-]+)/],

  detect(url: string): boolean {
    return this.urlPatterns.some((pattern) => pattern.test(url));
  },

  parse(doc: Document, url: string, extraData?: Record<string, any>): ExtractedLearningData {
    const headlineEl = doc.querySelector('h1.post-title, h1.article-title, meta[property="og:title"]');
    const headline = headlineEl ? (headlineEl.getAttribute('content') || headlineEl.textContent || '').trim() : doc.title;

    const pubEl = doc.querySelector('.publication-title, meta[property="og:site_name"]');
    const publication = pubEl ? (pubEl.getAttribute('content') || pubEl.textContent || '').trim() : 'Substack';

    const authorEl = doc.querySelector('.post-author, a[rel="author"], .author-name');
    const author = authorEl ? authorEl.textContent?.trim() || '' : publication;

    // Estimate reading time from word count
    const bodyText = doc.querySelector('.body.markup, article, .post-content')?.textContent || '';
    const wordCount = bodyText.split(/\s+/).length;
    const estReadingTimeMinutes = Math.max(1, Math.ceil(wordCount / 225));

    const scrollPercent = extraData?.scrollPercent || 0;
    const remainingMinutes = Math.max(0, Math.ceil(estReadingTimeMinutes * (1 - scrollPercent / 100)));

    const imageEl = doc.querySelector('meta[property="og:image"]');
    const thumbnail = imageEl ? imageEl.getAttribute('content') || '' : '';

    return {
      title: headline || 'Substack Article',
      subtitle: `${author} · ${publication}`,
      url,
      thumbnail,
      type: 'newsletters',
      source: 'substack',
      favicon: 'https://substack.com/favicon.ico',
      tags: ['Substack', publication, 'Newsletter'].filter(Boolean),
      resumePoint: {
        scrollPercent
      },
      completionPercent: Math.min(100, scrollPercent),
      estimatedRemainingMinutes: remainingMinutes,
      metadata: {
        headline,
        author,
        publication
      }
    };
  },

  getCompletionThreshold(): number {
    return 95;
  }
};
