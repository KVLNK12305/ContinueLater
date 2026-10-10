import { LearningSource, ExtractedLearningData } from './types';

export const PdfParser: LearningSource = {
  name: 'pdf',
  urlPatterns: [/\.pdf($|\?)/i, /^file:\/\/.*\.pdf/i],

  detect(url: string): boolean {
    return (
      this.urlPatterns.some((pattern) => pattern.test(url)) ||
      (typeof document !== 'undefined' && document.contentType === 'application/pdf')
    );
  },

  parse(doc: Document, url: string, extraData?: Record<string, any>): ExtractedLearningData {
    const urlFilename = url.split('/').pop()?.split('?')[0] || 'Document.pdf';
    const fileName = decodeURIComponent(urlFilename);

    const currentPage = extraData?.pageNumber || 1;
    const totalPages = extraData?.totalPages || 10;
    const scrollPercent = extraData?.scrollPercent || Math.round((currentPage / totalPages) * 100);

    const remainingPages = Math.max(0, totalPages - currentPage);
    const estimatedRemainingMinutes = Math.max(1, Math.ceil(remainingPages * 2)); // 2 mins per page avg

    return {
      title: fileName,
      subtitle: `PDF Document · Page ${currentPage} of ${totalPages}`,
      url,
      thumbnail: '',
      type: 'pdf',
      source: 'pdf',
      favicon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23e53935"><path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5z"/></svg>',
      tags: ['PDF', fileName].filter(Boolean),
      resumePoint: {
        pageNumber: currentPage,
        scrollPercent
      },
      completionPercent: Math.min(100, scrollPercent),
      estimatedRemainingMinutes,
      metadata: {
        fileName,
        totalPages
      }
    };
  },

  getCompletionThreshold(): number {
    return 95;
  }
};
