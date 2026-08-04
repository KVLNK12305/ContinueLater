import { LearningSource, ExtractedLearningData } from './types';
import { YoutubeParser } from './youtube';
import { GoogleSearchParser } from './google-search';
import { SubstackParser } from './substack';
import { MediumParser } from './medium';
import { GitHubParser } from './github';
import { DevToParser } from './devto';
import { HashnodeParser } from './hashnode';
import { WikipediaParser } from './wikipedia';
import { GoogleDocsParser } from './google-docs';
import { PdfParser } from './pdf';
import { GenericParser } from './generic';

const parsers: LearningSource[] = [
  YoutubeParser,
  GoogleSearchParser,
  SubstackParser,
  MediumParser,
  GitHubParser,
  DevToParser,
  HashnodeParser,
  WikipediaParser,
  GoogleDocsParser,
  PdfParser
];

export function getParserForUrl(url: string): LearningSource {
  let targetParser: LearningSource | null = null;
  for (const parser of parsers) {
    if (parser.detect(url)) {
      targetParser = parser;
      break;
    }
  }

  const parserToUse = targetParser || GenericParser;

  // Return a wrapped parser decorated with a safe try-catch fallback chain
  return {
    ...parserToUse,
    parse(doc: Document, url: string, extraData?: Record<string, any>): ExtractedLearningData {
      try {
        const result = parserToUse.parse(doc, url, extraData);
        // Self-test: If site-specific parser returned empty title or missing fields, force fallback
        if (parserToUse.name !== 'generic' && (!result || !result.title || result.title.trim() === '')) {
          console.warn(`[ContinueLater Registry] Parser '${parserToUse.name}' returned invalid/empty data. Falling back to generic parser.`);
          return GenericParser.parse(doc, url, extraData);
        }
        return result;
      } catch (error) {
        console.error(`[ContinueLater Registry] Parser '${parserToUse.name}' failed during DOM parsing:`, error);
        try {
          console.log(`[ContinueLater Registry] Attempting generic parser fallback for ${url}...`);
          return GenericParser.parse(doc, url, extraData);
        } catch (fallbackError) {
          console.error('[ContinueLater Registry] CRITICAL: Generic fallback parser also failed:', fallbackError);
          // Ultimate safe object return to prevent content scripts or trackers from crashing
          return {
            title: doc?.title || 'Learning Webpage',
            subtitle: new URL(url).hostname.replace('www.', ''),
            url,
            thumbnail: '',
            type: 'reading',
            source: 'generic',
            favicon: `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=32`,
            tags: ['Reading'],
            resumePoint: { scrollPercent: extraData?.scrollPercent || 0 },
            completionPercent: extraData?.scrollPercent || 0,
            estimatedRemainingMinutes: 5,
            metadata: {}
          };
        }
      }
    }
  };
}

export function getAllParsers(): LearningSource[] {
  return parsers;
}
