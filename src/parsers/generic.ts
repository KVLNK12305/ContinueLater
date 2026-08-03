import { LearningSource, ExtractedLearningData } from './types';

export const GenericParser: LearningSource = {
  name: 'generic',
  urlPatterns: [],

  detect(): boolean {
    return true; // Fallback
  },

  parse(doc: Document, url: string, extraData?: Record<string, any>): ExtractedLearningData {
    const titleEl = doc.querySelector('h1, meta[property="og:title"]');
    const title = titleEl ? (titleEl.getAttribute('content') || titleEl.textContent || '').trim() : doc.title;

    const hostname = new URL(url).hostname.replace('www.', '');

    const scrollPercent = extraData?.scrollPercent || 0;
    const bodyText = doc.body?.textContent || '';
    const wordCount = bodyText.split(/\s+/).length;
    const estReadingMinutes = Math.max(1, Math.ceil(wordCount / 225));
    const remainingMinutes = Math.max(0, Math.ceil(estReadingMinutes * (1 - scrollPercent / 100)));

    const imageEl = doc.querySelector('meta[property="og:image"]');
    const thumbnail = imageEl ? imageEl.getAttribute('content') || '' : '';

    return {
      title: title || 'Learning Webpage',
      subtitle: hostname,
      url,
      thumbnail,
      type: 'reading',
      source: 'generic',
      favicon: `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`,
      tags: [hostname, 'Reading'].filter(Boolean),
      resumePoint: {
        scrollPercent
      },
      completionPercent: Math.min(100, scrollPercent),
      estimatedRemainingMinutes: remainingMinutes,
      metadata: {
        headline: title
      }
    };
  },

  getCompletionThreshold(): number {
    return 90;
  }
};
