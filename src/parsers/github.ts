import { LearningSource, ExtractedLearningData } from './types';

export const GitHubParser: LearningSource = {
  name: 'github',
  urlPatterns: [/^https:\/\/(www\.)?github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+/],

  detect(url: string): boolean {
    return this.urlPatterns.some((pattern) => pattern.test(url));
  },

  parse(doc: Document, url: string, extraData?: Record<string, any>): ExtractedLearningData {
    const urlParts = new URL(url).pathname.split('/').filter(Boolean);
    const repoName = urlParts.length >= 2 ? `${urlParts[0]}/${urlParts[1]}` : 'GitHub Repo';

    // Sub-path detection: README vs Discussion vs File
    const isDiscussion = url.includes('/discussions');
    const isBlob = url.includes('/blob/');
    const isReadme = !isDiscussion && !isBlob;

    // Stars
    const starEl = doc.querySelector('#repo-stars-counter-star, .js-social-count, a[href$="/stargazers"]');
    const starsText = starEl?.textContent?.trim() || '0';
    let stars = 0;
    if (starsText.includes('k')) {
      stars = Math.round(parseFloat(starsText.replace('k', '')) * 1000);
    } else {
      stars = parseInt(starsText.replace(/,/g, ''), 10) || 0;
    }

    // Main Language
    const langEl = doc.querySelector('.repository-lang-stats-graph, span.color-fg-default.text-bold');
    const language = langEl?.textContent?.trim() || 'Code';

    // Opened files or discussion title
    const openedFiles: string[] = [];
    if (isBlob && urlParts.length > 3) {
      openedFiles.push(urlParts.slice(4).join('/'));
    }

    let title = repoName;
    if (isDiscussion) {
      const discTitle = doc.querySelector('.js-issue-title')?.textContent?.trim();
      title = discTitle ? `${discTitle} · ${repoName}` : `Discussion: ${repoName}`;
    } else if (isBlob && openedFiles.length > 0) {
      title = `${openedFiles[0]} · ${repoName}`;
    }

    const scrollPercent = extraData?.scrollPercent || 0;
    const remainingMinutes = Math.max(1, Math.ceil((100 - scrollPercent) / 20));

    return {
      title,
      subtitle: `${language} · ⭐ ${stars.toLocaleString()} stars`,
      url,
      thumbnail: `https://opengraph.githubassets.com/1/${repoName}`,
      type: 'github',
      source: 'github',
      favicon: 'https://github.githubassets.com/favicons/favicon.png',
      tags: ['GitHub', language, repoName].filter(Boolean),
      resumePoint: {
        scrollPercent
      },
      completionPercent: Math.min(100, scrollPercent),
      estimatedRemainingMinutes: remainingMinutes,
      metadata: {
        repo: repoName,
        stars,
        language,
        openedFiles
      }
    };
  },

  getCompletionThreshold(): number {
    return 95;
  }
};
