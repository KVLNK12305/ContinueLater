import { LearningSource, ExtractedLearningData } from './types';

export const GoogleDocsParser: LearningSource = {
  name: 'google-docs',
  urlPatterns: [/^https:\/\/docs\.google\.com\/document\/d\//],

  detect(url: string): boolean {
    return this.urlPatterns.some((pattern) => pattern.test(url));
  },

  parse(doc: Document, url: string, extraData?: Record<string, any>): ExtractedLearningData {
    const titleEl = doc.querySelector('.docs-title-input, meta[property="og:title"]');
    const title = titleEl ? (titleEl.getAttribute('value') || titleEl.getAttribute('content') || titleEl.textContent || '').trim() : doc.title.replace('- Google Docs', '').trim();

    const scrollPercent = extraData?.scrollPercent || 0;
    const remainingMinutes = Math.max(1, Math.ceil((100 - scrollPercent) / 15));

    return {
      title: title || 'Google Document',
      subtitle: 'Google Docs (Read-only)',
      url,
      thumbnail: '',
      type: 'research',
      source: 'google-docs',
      favicon: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico',
      tags: ['Google Docs', 'Document', title].filter(Boolean),
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
    return 95;
  }
};
