import React, { useState, useMemo } from 'react';
import { useLearningItems } from '../../hooks/useLearningItems';
import { useStats } from '../../hooks/useStats';
import { filterAndSearchLearningItems } from '../../utils/search';
import { FilterCategory, DEFAULT_FILTERS } from '../../types/filters';
import { LearningCard } from '../../components/LearningCard';
import { FilterBar } from '../../components/FilterBar';
import { SearchBar } from '../../components/SearchBar';
import { StreakDisplay } from '../../components/StreakDisplay';
import { EmptyState } from '../../components/EmptyState';
import { Search, CheckCircle2 } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { items, loading, resumeItem, deleteItem, markCompleted, refreshItems } = useLearningItems();
  const { stats } = useStats();

  const [category, setCategory] = useState<FilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Unfinished items only for main dashboard
  const unfinishedItems = useMemo(() => {
    return items.filter((item) => item.status === 'unfinished' || item.status === 'snoozed');
  }, [items]);

  const filteredItems = useMemo(() => {
    return filterAndSearchLearningItems(unfinishedItems, {
      ...DEFAULT_FILTERS,
      category,
      searchQuery
    });
  }, [unfinishedItems, category, searchQuery]);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: unfinishedItems.length };
    unfinishedItems.forEach((item) => {
      counts[item.type] = (counts[item.type] || 0) + 1;
      if (item.source === 'youtube') counts['watching'] = (counts['watching'] || 0) + 1;
      if (item.source === 'github') counts['github'] = (counts['github'] || 0) + 1;
      if (item.source === 'substack') counts['newsletters'] = (counts['newsletters'] || 0) + 1;
      if (item.source === 'medium' || item.source === 'devto' || item.source === 'hashnode') {
        counts['articles'] = (counts['articles'] || 0) + 1;
      }
      if (item.source === 'pdf') counts['pdf'] = (counts['pdf'] || 0) + 1;
    });
    return counts;
  }, [unfinishedItems]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '10px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--md-sys-color-on-surface)' }}>
            ContinueLater
          </h2>
          <p style={{ fontSize: '10px', color: 'var(--md-sys-color-on-surface-variant)' }}>
            Never lose your learning flow.
          </p>
        </div>
        <StreakDisplay streak={stats.currentStreak} xp={stats.xp} level={stats.level} />
      </div>

      {/* Search Bar */}
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      {/* Filter Chips */}
      <FilterBar
        activeCategory={category}
        onSelectCategory={setCategory}
        counts={categoryCounts}
      />

      {/* Main List Area */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '2px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '24px', color: 'var(--md-sys-color-on-surface-variant)', fontSize: '12px' }}>
            Loading your learning sessions...
          </div>
        ) : filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <LearningCard
              key={item.id}
              item={item}
              onResume={resumeItem}
              onDelete={deleteItem}
              onComplete={markCompleted}
              onRefresh={refreshItems}
            />
          ))
        ) : (
          <EmptyState
            icon={searchQuery ? <Search size={32} color="var(--md-sys-color-primary)" /> : <CheckCircle2 size={32} color="var(--md-sys-color-success)" />}
            title={searchQuery ? 'No matching learning sessions' : 'All caught up!'}
            description={
              searchQuery
                ? 'Try adjusting your search query or filters.'
                : 'Visit YouTube, Substack, Medium, or GitHub to start learning. Unfinished sessions will appear here.'
            }
          />
        )}
      </div>
    </div>
  );
};
