import { LearningSource, ExtractedLearningData } from './types';

export const WikipediaParser: LearningSource = {
  name: 'wikipedia',
  urlPatterns: [/^https:\/\/[a-z]+\.wikipedia\.org\/wiki\//],

  detect(url: string): boolean {
    return this.urlPatterns.some((pattern) => pattern.test(url));
  },

  parse(doc: Document, url: string, extraData?: Record<string, any>): ExtractedLearningData {
    const articleTitleEl = doc.querySelector('#firstHeading, h1#section_0');
    const articleTitle = articleTitleEl ? articleTitleEl.textContent?.trim() || '' : doc.title.replace('- Wikipedia', '').trim();

    const bodyText = doc.querySelector('#bodyContent, #mw-content-text')?.textContent || '';
    const wordCount = bodyText.split(/\s+/).length;
    const estReadingMinutes = Math.max(1, Math.ceil(wordCount / 250));

    const scrollPercent = extraData?.scrollPercent || 0;
    const remainingMinutes = Math.max(0, Math.ceil(estReadingMinutes * (1 - scrollPercent / 100)));

    const imageEl = doc.querySelector('.infobox img, .mw-file-description img');
    const thumbnail = imageEl ? (imageEl as HTMLImageElement).src : '';

    return {
      title: articleTitle || 'Wikipedia Article',
      subtitle: 'Wikipedia Encyclopedia',
      url,
      thumbnail,
      type: 'research',
      source: 'wikipedia',
      favicon: 'https://en.wikipedia.org/static/favicon/wikipedia.ico',
      tags: ['Wikipedia', 'Research', articleTitle].filter(Boolean),
      resumePoint: {
        scrollPercent
      },
      completionPercent: Math.min(100, scrollPercent),
      estimatedRemainingMinutes: remainingMinutes,
      metadata: {
        articleTitle
      }
    };
  },

  getCompletionThreshold(): number {
    return 95;
  }
};
