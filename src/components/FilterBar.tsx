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
        gap: '6px',
        overflowX: 'auto',
        padding: '4px 0',
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
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '5px 10px',
              borderRadius: 'var(--radius-full)',
              fontSize: '11px',
              fontWeight: isActive ? 600 : 400,
              whiteSpace: 'nowrap',
              backgroundColor: isActive ? 'var(--md-sys-color-primary-container)' : 'var(--md-sys-color-surface-variant)',
              color: isActive ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-surface-variant)',
              border: isActive ? '1px solid var(--md-sys-color-primary)' : '1px solid var(--md-sys-color-outline-variant)'
            }}
          >
            {cat.icon}
            <span>{cat.label}</span>
            {count > 0 && (
              <span
                style={{
                  fontSize: '9px',
                  padding: '1px 5px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: isActive ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline)',
                  color: isActive ? '#fff' : 'var(--md-sys-color-on-surface)'
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
