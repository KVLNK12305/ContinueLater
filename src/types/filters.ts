import { LearningType, SourceType, LearningStatus } from './enums';

export type FilterCategory = 'all' | LearningType;

export interface FilterOptions {
  category: FilterCategory;
  source?: SourceType;
  status?: LearningStatus;
  searchQuery: string;
  sortBy: 'lastSeen' | 'progress' | 'remainingTime' | 'title';
  sortOrder: 'asc' | 'desc';
}

export const DEFAULT_FILTERS: FilterOptions = {
  category: 'all',
  searchQuery: '',
  sortBy: 'lastSeen',
  sortOrder: 'desc'
};
