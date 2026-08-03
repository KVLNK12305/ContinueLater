export type SourceType =
  | 'youtube'
  | 'google-search'
  | 'substack'
  | 'medium'
  | 'github'
  | 'devto'
  | 'hashnode'
  | 'wikipedia'
  | 'google-docs'
  | 'pdf'
  | 'generic';

export type LearningType =
  | 'watching'
  | 'reading'
  | 'coding'
  | 'research'
  | 'newsletters'
  | 'articles'
  | 'github'
  | 'pdf';

export type LearningStatus =
  | 'active'
  | 'unfinished'
  | 'completed'
  | 'dismissed'
  | 'snoozed';

export type ScheduleOption =
  | 'tomorrow'
  | 'after_lunch'
  | 'this_evening'
  | 'weekend'
  | 'next_monday'
  | 'never'
  | 'custom';
