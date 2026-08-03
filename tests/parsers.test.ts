import { describe, it, expect, beforeEach } from 'vitest';
import { getParserForUrl } from '../src/parsers/registry';
import { YoutubeParser } from '../src/parsers/youtube';
import { GoogleSearchParser } from '../src/parsers/google-search';
import { SubstackParser } from '../src/parsers/substack';
import { MediumParser } from '../src/parsers/medium';
import { GitHubParser } from '../src/parsers/github';
import { WikipediaParser } from '../src/parsers/wikipedia';
import { PdfParser } from '../src/parsers/pdf';

describe('Parser System & Registry', () => {
  it('detects correct parser based on URL', () => {
    expect(getParserForUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ').name).toBe('youtube');
    expect(getParserForUrl('https://www.google.com/search?q=AI+Agents').name).toBe('google-search');
    expect(getParserForUrl('https://lilianweng.substack.com/p/agent-system').name).toBe('substack');
    expect(getParserForUrl('https://medium.com/@user/article-slug').name).toBe('medium');
    expect(getParserForUrl('https://github.com/facebook/react').name).toBe('github');
    expect(getParserForUrl('https://en.wikipedia.org/wiki/Artificial_intelligence').name).toBe('wikipedia');
    expect(getParserForUrl('https://example.com/paper.pdf').name).toBe('pdf');
  });

  it('parses YouTube video metadata and progress correctly', () => {
    const doc = document.createElement('html');
    doc.innerHTML = '<h1 class="title">Deep Learning 101</h1><a class="yt-user-name">3Blue1Brown</a>';

    const result = YoutubeParser.parse(doc as any, 'https://www.youtube.com/watch?v=12345', {
      currentTime: 300,
      duration: 600
    });

    expect(result.source).toBe('youtube');
    expect(result.type).toBe('watching');
    expect(result.completionPercent).toBe(50);
    expect(result.estimatedRemainingMinutes).toBe(5);
    expect(result.resumePoint.timestamp).toBe(300);
  });

  it('parses GitHub repository correctly', () => {
    const doc = document.createElement('html');
    doc.innerHTML = '<span class="js-social-count">12.5k</span>';

    const result = GitHubParser.parse(doc as any, 'https://github.com/torvalds/linux', {
      scrollPercent: 40
    });

    expect(result.source).toBe('github');
    expect(result.metadata.repo).toBe('torvalds/linux');
    expect(result.completionPercent).toBe(40);
  });

  it('parses PDF correctly', () => {
    const result = PdfParser.parse(document, 'https://arxiv.org/pdf/2301.00001.pdf', {
      pageNumber: 5,
      totalPages: 20
    });

    expect(result.source).toBe('pdf');
    expect(result.type).toBe('pdf');
    expect(result.completionPercent).toBe(25);
    expect(result.estimatedRemainingMinutes).toBe(30);
  });
});
