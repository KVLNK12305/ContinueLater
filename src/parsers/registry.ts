import { LearningSource } from './types';
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
  for (const parser of parsers) {
    if (parser.detect(url)) {
      return parser;
    }
  }
  return GenericParser;
}

export function getAllParsers(): LearningSource[] {
  return parsers;
}
