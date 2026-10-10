import React, { useState, useEffect, useMemo } from 'react';
import { useLearningItems } from '../../hooks/useLearningItems';
import { useStats } from '../../hooks/useStats';
import { filterAndSearchLearningItems } from '../../utils/search';
import { FilterCategory, DEFAULT_FILTERS } from '../../types/filters';
import { LearningCard } from '../../components/LearningCard';
import { FilterBar } from '../../components/FilterBar';
import { SearchBar } from '../../components/SearchBar';
import { StreakDisplay } from '../../components/StreakDisplay';
import { EmptyState } from '../../components/EmptyState';
import { Search, CheckCircle2, BookmarkPlus, Check } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { items, loading, resumeItem, deleteItem, markCompleted, refreshItems, captureCurrentTab } = useLearningItems();
  const { stats } = useStats();

  const [category, setCategory] = useState<FilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [capturing, setCapturing] = useState(false);
  const [capturedSuccess, setCapturedSuccess] = useState(false);

  const handleCaptureCurrentTab = async () => {
    setCapturing(true);
    const success = await captureCurrentTab();
    setCapturing(false);
    if (success) {
      setCapturedSuccess(true);
      setTimeout(() => setCapturedSuccess(false), 2000);
    }
  };

  // Debounce search query input to prevent jank
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 150);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Unfinished items only for main dashboard
  const unfinishedItems = useMemo(() => {
    return items.filter((item) => item.status === 'unfinished' || item.status === 'snoozed');
  }, [items]);

  const filteredItems = useMemo(() => {
    return filterAndSearchLearningItems(unfinishedItems, {
      ...DEFAULT_FILTERS,
      category,
      searchQuery: debouncedSearchQuery
    });
  }, [unfinishedItems, category, debouncedSearchQuery]);

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 4px 4px 4px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--nm-text-primary)' }}>
            Continue<span style={{ color: 'var(--nm-accent)' }}>Later</span>
          </h2>
          <p style={{ fontSize: '11px', color: 'var(--nm-text-secondary)', fontWeight: 500, fontStyle: 'italic', marginTop: '2px' }}>
            Never lose your learning flow.
          </p>
        </div>
        <StreakDisplay streak={stats.currentStreak} xp={stats.xp} level={stats.level} />
      </div>

      {/* Search Bar & Quick Capture Button */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
        <button
          onClick={handleCaptureCurrentTab}
          disabled={capturing}
          className="nm-btn nm-btn-primary"
          style={{
            fontSize: '11px',
            padding: '8px 12px',
            gap: '6px',
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}
          title="Save active tab right now"
        >
          {capturedSuccess ? (
            <>
              <Check size={13} color="var(--nm-success)" /> Saved!
            </>
          ) : (
            <>
              <BookmarkPlus size={13} /> {capturing ? 'Saving...' : 'Save Tab'}
            </>
          )}
        </button>
      </div>

      {/* Filter Chips */}
      <FilterBar
        activeCategory={category}
        onSelectCategory={setCategory}
        counts={categoryCounts}
      />

      {/* Main List Area */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '2px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '24px', color: 'var(--nm-text-secondary)', fontSize: '12px', fontStyle: 'italic' }}>
            Preparing your canvas...
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
            icon={searchQuery ? <Search size={28} color="var(--nm-accent)" /> : <CheckCircle2 size={28} color="var(--nm-accent)" />}
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
