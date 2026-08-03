import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search by title, author, topic...'
}) => {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '100%'
      }}
    >
      <Search
        size={14}
        style={{
          position: 'absolute',
          left: '10px',
          color: 'var(--md-sys-color-on-surface-variant)'
        }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '8px 30px 8px 30px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--md-sys-color-surface-variant)',
          border: '1px solid var(--md-sys-color-outline-variant)',
          color: 'var(--md-sys-color-on-surface)',
          fontSize: '12px',
          outline: 'none'
        }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          style={{
            position: 'absolute',
            right: '8px',
            color: 'var(--md-sys-color-on-surface-variant)'
          }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
