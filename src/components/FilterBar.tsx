import React from 'react';
import { FilterCategory } from '../types/filters';
import { Zap, Tv, BookOpen, Code, Search, Mail, GitBranch, FileText, File } from 'lucide-react';

interface FilterBarProps {
  activeCategory: FilterCategory;
  onSelectCategory: (cat: FilterCategory) => void;
  counts: Record<string, number>;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  activeCategory,
  onSelectCategory,
  counts
}) => {
  const categories: { key: FilterCategory; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: 'All', icon: <Zap size={12} /> },
    { key: 'watching', label: 'Watching', icon: <Tv size={12} /> },
    { key: 'reading', label: 'Reading', icon: <BookOpen size={12} /> },
    { key: 'coding', label: 'Coding', icon: <Code size={12} /> },
    { key: 'research', label: 'Research', icon: <Search size={12} /> },
    { key: 'newsletters', label: 'Newsletters', icon: <Mail size={12} /> },
    { key: 'github', label: 'GitHub', icon: <GitBranch size={12} /> },
    { key: 'articles', label: 'Articles', icon: <FileText size={12} /> },
    { key: 'pdf', label: 'PDFs', icon: <File size={12} /> }
  ];

  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        padding: '6px 4px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}
    >
      {categories.map((cat) => {
        const count = counts[cat.key] || 0;
        const isActive = activeCategory === cat.key;

        return (
          <button
            key={cat.key}
            onClick={() => onSelectCategory(cat.key)}
            className={`painted-chip painted-interactive ${isActive ? 'painted-chip-active' : ''}`}
            style={{ padding: '6px 14px' }}
          >
            {cat.icon}
            <span>{cat.label}</span>
            {count > 0 && (
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-full)',
                  background: isActive ? 'rgba(0,0,0,0.2)' : 'var(--color-surface)',
                  color: isActive ? '#2a2212' : 'var(--md-sys-color-on-surface)',
                  boxShadow: isActive ? 'none' : 'inset 1px 1px 2px rgba(0,0,0,0.5)'
                }}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
