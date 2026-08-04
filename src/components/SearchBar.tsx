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
        width: '100%',
        marginTop: '4px'
      }}
    >
      <Search
        size={16}
        style={{
          position: 'absolute',
          left: '14px',
          color: value ? 'var(--nm-accent)' : 'var(--nm-text-secondary)',
          zIndex: 1,
          transition: 'color 0.3s ease'
        }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="nm-input"
        style={{
          width: '100%',
          padding: '12px 36px 12px 40px',
          fontSize: '13px'
        }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="nm-btn-icon"
          style={{
            position: 'absolute',
            right: '8px',
            width: '28px',
            height: '28px'
          }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
