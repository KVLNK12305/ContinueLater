import { LearningObject } from '../types/learning-object';

/**
 * Builds an enriched resume URL that takes the user directly back
 * to their exact position (e.g. video timestamp or article scroll position).
 */
export function buildResumeUrl(item: LearningObject): string {
  if (!item || !item.url) return '';

  try {
    const parsed = new URL(item.url);

    // 1. YouTube timestamp resumption
    if (item.source === 'youtube' && item.resumePoint?.timestamp && item.resumePoint.timestamp > 0) {
      parsed.searchParams.set('t', `${item.resumePoint.timestamp}s`);
      return parsed.toString();
    }

    // 2. Generic / Web / Article scroll position resumption
    if (item.resumePoint?.scrollPercent && item.resumePoint.scrollPercent > 0) {
      if (!parsed.hash) {
        parsed.hash = `cl-resume=${item.resumePoint.scrollPercent}`;
      }
      return parsed.toString();
    }

    // 3. PDF page resumption
    if (item.source === 'pdf' && item.resumePoint?.pageNumber && item.resumePoint.pageNumber > 1) {
      if (!parsed.hash) {
        parsed.hash = `page=${item.resumePoint.pageNumber}`;
      }
      return parsed.toString();
    }
  } catch {
    // If URL parsing fails, return original
  }

  return item.url;
}

/**
 * Generates a Unicode-safe persistent ID from any URL without throwing DOMException
 */
export function safeUrlId(url: string): string {
  try {
    return `item_${btoa(unescape(encodeURIComponent(url))).substring(0, 32).replace(/[^a-zA-Z0-9]/g, '')}`;
  } catch {
    let hash = 0;
    for (let i = 0; i < url.length; i++) {
      hash = (hash << 5) - hash + url.charCodeAt(i);
      hash |= 0;
    }
    return `item_${Math.abs(hash).toString(36)}`;
  }
}

/**
 * Generates a beautiful Markdown summary of unfinished sessions for Notion / Obsidian
 */
export function generateMarkdownDigest(items: LearningObject[]): string {
  const unfinished = items.filter((i) => i.status === 'unfinished' || i.status === 'snoozed');
  const dateStr = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  let md = `# 📚 ContinueLater — Learning Continuity Digest\n`;
  md += `*Generated on ${dateStr} · ${unfinished.length} unfinished sessions*\n\n`;

  if (unfinished.length === 0) {
    md += `All caught up! No active unfinished learning sessions.\n`;
    return md;
  }

  md += `| Source | Title | Progress | Est. Remaining | Resume Link |\n`;
  md += `| :--- | :--- | :---: | :---: | :--- |\n`;

  unfinished.forEach((item) => {
    const resumeUrl = buildResumeUrl(item);
    const source = item.source.toUpperCase();
    const cleanTitle = item.title.replace(/\|/g, '-');
    const remaining = item.estimatedRemainingMinutes > 0 ? `${item.estimatedRemainingMinutes} min` : 'Almost done';
    md += `| ${source} | ${cleanTitle} | ${item.completionPercent}% | ${remaining} | [Resume Session](${resumeUrl}) |\n`;
  });

  md += `\n---\n*Never lose your learning flow — Powered by ContinueLater*\n`;
  return md;
}
