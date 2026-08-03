import { SourceType, LearningType, LearningStatus } from './enums';

export interface ResumePoint {
  scrollPercent?: number;
  timestamp?: number;
  pageNumber?: number;
  selector?: string;
  query?: string;
}

export interface SourceMetadata {
  headline?: string;
  channel?: string;
  author?: string;
  publication?: string;
  duration?: number;
  captionsAvailable?: boolean;
  repo?: string;
  stars?: number;
  language?: string;
  openedFiles?: string[];
  searchQuery?: string;
  visitedResults?: string[];
  articleTitle?: string;
  fileName?: string;
  totalPages?: number;
}

export interface LearningObject {
  id: string;
  type: LearningType;
  title: string;
  subtitle: string;
  url: string;
  thumbnail: string;
  resumePoint: ResumePoint;
  completionPercent: number;
  estimatedRemainingMinutes: number;
  firstSeen: number;
  lastSeen: number;
  source: SourceType;
  tags: string[];
  favicon: string;
  readingProgress: number; // 0 to 100
  watchProgress: number; // 0 to 100
  status: LearningStatus;
  scheduledTime?: number; // Epoch timestamp for smart reminders
  metadata: SourceMetadata;
}
