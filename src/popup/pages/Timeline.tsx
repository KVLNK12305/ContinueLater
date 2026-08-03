import React, { useMemo } from 'react';
import { useLearningItems } from '../../hooks/useLearningItems';
import { formatRelativeDate, formatRemainingTime } from '../../utils/time';
import { ProgressRing } from '../../components/ProgressRing';
import { LearningObject } from '../../types/learning-object';
import { Play, Trash2, Calendar, Clock } from 'lucide-react';
import { EmptyState } from '../../components/EmptyState';

export const Timeline: React.FC = () => {
  const { items, loading, resumeItem, deleteItem } = useLearningItems();

  // Group items by relative date
  const groupedTimeline = useMemo(() => {
    const groups: Map<string, LearningObject[]> = new Map();

    items.forEach((item) => {
      const groupKey = formatRelativeDate(item.lastSeen);
      const existing = groups.get(groupKey) || [];
      existing.push(item);
      groups.set(groupKey, existing);
    });

    return Array.from(groups.entries());
  }, [items]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '10px' }}>
      <div style={{ padding: '0 4px' }}>
        <h2 className="display-font" style={{ fontSize: '20px', fontWeight: 800, color: 'var(--md-sys-color-on-surface)' }}>
          Learning Timeline
        </h2>
        <p style={{ fontSize: '11px', color: 'var(--md-sys-color-on-surface-variant)', fontStyle: 'italic' }}>
          Chronological history of your learning sessions
        </p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '4px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '24px', fontSize: '12px', fontStyle: 'italic' }}>Painting timeline...</div>
        ) : groupedTimeline.length > 0 ? (
          groupedTimeline.map(([groupTitle, groupItems]) => (
            <div key={groupTitle} className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                className="painted-chip"
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: 'var(--color-moon-yellow)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  padding: '6px 14px',
                  alignSelf: 'flex-start',
                  border: '1px solid var(--color-moon-glow)'
                }}
              >
                <Calendar size={12} /> {groupTitle}
              </div>

              {groupItems.map((item) => (
                <div
                  key={item.id}
                  className="painted-card painted-card-interactive"
                  style={{
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
                    <ProgressRing progress={item.completionPercent} showText size={36} />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <h4
                        className="display-font"
                        style={{
                          fontSize: '14px',
                          fontWeight: 700,
                          color: 'var(--md-sys-color-on-surface)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {item.title}
                      </h4>
                      <p style={{ fontSize: '11px', color: 'var(--md-sys-color-on-surface-variant)', fontWeight: 500, marginTop: '2px' }}>
                        {item.source.toUpperCase()} · <span className="painted-text-accent">{formatRemainingTime(item.estimatedRemainingMinutes)}</span>
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => deleteItem(item.id)}
                      title="Delete"
                      className="painted-btn-icon painted-interactive"
                      style={{ padding: '6px', color: 'var(--md-sys-color-error)' }}
                    >
                      <Trash2 size={14} />
                    </button>
                    <button
                      onClick={() => resumeItem(item)}
                      className="painted-btn painted-btn-primary painted-interactive"
                      style={{
                        padding: '6px 14px',
                        fontSize: '12px',
                        fontWeight: 700
                      }}
                    >
                      <Play size={10} fill="currentColor" /> Resume
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))
        ) : (
          <EmptyState
            icon={<Clock size={32} color="#2a2212" />}
            title="No timeline history yet"
            description="Start browsing learning content on supported sites to populate your timeline."
          />
        )}
      </div>
    </div>
  );
};
