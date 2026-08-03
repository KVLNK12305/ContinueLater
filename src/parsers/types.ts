import { SourceType, LearningType } from '../types/enums';
import { LearningObject, SourceMetadata, ResumePoint } from '../types/learning-object';

export interface ExtractedLearningData {
  title: string;
  subtitle: string;
  url: string;
  thumbnail: string;
  type: LearningType;
  source: SourceType;
  favicon: string;
  tags: string[];
  resumePoint: ResumePoint;
  completionPercent: number;
  estimatedRemainingMinutes: number;
  metadata: SourceMetadata;
}

export interface LearningSource {
  name: SourceType;
  urlPatterns: RegExp[];
  detect(url: string): boolean;
  parse(document: Document, url: string, extraData?: Record<string, any>): ExtractedLearningData;
  getCompletionThreshold(): number; // Default percentage threshold for unfinished status
}
