import { LearningSource, ExtractedLearningData } from './types';

export const YoutubeParser: LearningSource = {
  name: 'youtube',
  urlPatterns: [/^https:\/\/(www\.)?youtube\.com\/watch/],

  detect(url: string): boolean {
    return this.urlPatterns.some((pattern) => pattern.test(url));
  },

  parse(doc: Document, url: string, extraData?: Record<string, any>): ExtractedLearningData {
    const urlObj = new URL(url);
    const videoId = urlObj.searchParams.get('v') || '';

    // Title
    const titleEl = doc.querySelector('h1.ytd-watch-metadata yt-formatted-string, h1.title, meta[property="og:title"]');
    const title = titleEl ? (titleEl.getAttribute('content') || titleEl.textContent || '').trim() : doc.title.replace('- YouTube', '').trim();

    // Channel
    const channelEl = doc.querySelector('#owner #channel-name a, ytd-channel-name a, meta[name="author"]');
    const channel = channelEl ? (channelEl.getAttribute('content') || channelEl.textContent || '').trim() : 'YouTube Channel';

    // Thumbnail
    const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';

    // Video media progress
    const currentTime = extraData?.currentTime || 0;
    const duration = extraData?.duration || 0;
    const playPercent = duration > 0 ? Math.min(100, Math.round((currentTime / duration) * 100)) : 0;
    const remainingSeconds = Math.max(0, duration - currentTime);
    const remainingMinutes = Math.ceil(remainingSeconds / 60);

    // Captions available check
    const captionsBtn = doc.querySelector('.ytp-subtitles-button');
    const captionsAvailable = captionsBtn ? captionsBtn.getAttribute('aria-disabled') !== 'true' : false;

    return {
      title: title || 'YouTube Video',
      subtitle: channel,
      url,
      thumbnail,
      type: 'watching',
      source: 'youtube',
      favicon: 'https://www.youtube.com/s/desktop/f5d1796d/img/favicon.ico',
      tags: ['Video', channel, 'YouTube'].filter(Boolean),
      resumePoint: {
        timestamp: Math.floor(currentTime)
      },
      completionPercent: playPercent,
      estimatedRemainingMinutes: remainingMinutes,
      metadata: {
        channel,
        duration: Math.round(duration),
        captionsAvailable
      }
    };
  },

  getCompletionThreshold(): number {
    return 90;
  }
};
