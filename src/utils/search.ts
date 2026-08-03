import { LearningObject } from '../types/learning-object';
import { FilterOptions } from '../types/filters';

export function filterAndSearchLearningItems(
  items: LearningObject[],
  filters: FilterOptions
): LearningObject[] {
  let result = [...items];

  // Category filter
  if (filters.category !== 'all') {
    result = result.filter((item) => {
      if (filters.category === 'watching') return item.type === 'watching' || item.source === 'youtube';
      if (filters.category === 'reading') return item.type === 'reading' || item.type === 'articles';
      if (filters.category === 'coding') return item.type === 'coding' || item.source === 'github';
      if (filters.category === 'research') return item.type === 'research' || item.source === 'wikipedia' || item.source === 'google-search';
      if (filters.category === 'newsletters') return item.source === 'substack' || item.type === 'newsletters';
      if (filters.category === 'articles') return item.source === 'medium' || item.source === 'devto' || item.source === 'hashnode';
      if (filters.category === 'pdf') return item.source === 'pdf' || item.type === 'pdf';
      return item.type === filters.category;
    });
  }

  // Source filter
  if (filters.source) {
    result = result.filter((item) => item.source === filters.source);
  }

  // Status filter
  if (filters.status) {
    result = result.filter((item) => item.status === filters.status);
  }

  // Search query filter (instant search)
  if (filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase().trim();
    result = result.filter((item) => {
      const inTitle = item.title.toLowerCase().includes(query);
      const inSubtitle = item.subtitle.toLowerCase().includes(query);
      const inTags = item.tags.some((t) => t.toLowerCase().includes(query));
      const inUrl = item.url.toLowerCase().includes(query);
      const inAuthor = item.metadata?.author?.toLowerCase().includes(query);
      const inChannel = item.metadata?.channel?.toLowerCase().includes(query);
      const inRepo = item.metadata?.repo?.toLowerCase().includes(query);
      const inSearchQuery = item.metadata?.searchQuery?.toLowerCase().includes(query);

      return (
        inTitle ||
        inSubtitle ||
        inTags ||
        inUrl ||
        Boolean(inAuthor) ||
        Boolean(inChannel) ||
        Boolean(inRepo) ||
        Boolean(inSearchQuery)
      );
    });
  }

  // Sorting
  result.sort((a, b) => {
    let comparison = 0;
    if (filters.sortBy === 'lastSeen') {
      comparison = b.lastSeen - a.lastSeen;
    } else if (filters.sortBy === 'progress') {
      comparison = b.completionPercent - a.completionPercent;
    } else if (filters.sortBy === 'remainingTime') {
      comparison = a.estimatedRemainingMinutes - b.estimatedRemainingMinutes;
    } else if (filters.sortBy === 'title') {
      comparison = a.title.localeCompare(b.title);
    }
    return filters.sortOrder === 'asc' ? -comparison : comparison;
  });

  return result;
}
