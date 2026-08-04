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
        <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--nm-text-primary)' }}>
          Learning Timeline
        </h2>
        <p style={{ fontSize: '11px', color: 'var(--nm-text-secondary)', fontStyle: 'italic', marginTop: '2px' }}>
          Chronological history of your learning sessions
        </p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '4px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '24px', fontSize: '12px', color: 'var(--nm-text-secondary)', fontStyle: 'italic' }}>Painting timeline...</div>
        ) : groupedTimeline.length > 0 ? (
          groupedTimeline.map(([groupTitle, groupItems]) => (
            <div key={groupTitle} className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                className="nm-chip"
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: 'var(--nm-accent)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  padding: '4px 12px',
                  alignSelf: 'flex-start',
                  boxShadow: '2px 2px 4px var(--nm-shadow-dark), -2px -2px 4px var(--nm-shadow-light)',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
              >
                <Calendar size={11} style={{ marginRight: '4px' }} /> {groupTitle}
              </div>

              {groupItems.map((item) => (
                <div
                  key={item.id}
                  className="nm-card nm-card-interactive"
                  style={{
                    padding: '12px 14px',
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
                        style={{
                          fontSize: '13px',
                          fontWeight: 700,
                          color: 'var(--nm-text-primary)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {item.title}
                      </h4>
                      <p style={{ fontSize: '10px', color: 'var(--nm-text-secondary)', fontWeight: 500, marginTop: '2px' }}>
                        {item.source.toUpperCase()} · <span style={{ color: 'var(--nm-accent)' }}>{formatRemainingTime(item.estimatedRemainingMinutes)}</span>
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => deleteItem(item.id)}
                      title="Delete"
                      className="nm-btn-icon"
                      style={{ width: '28px', height: '28px', color: 'var(--nm-danger)' }}
                    >
                      <Trash2 size={13} />
                    </button>
                    <button
                      onClick={() => resumeItem(item)}
                      className="nm-btn nm-btn-primary"
                      style={{
                        padding: '6px 12px',
                        fontSize: '11px',
                        fontWeight: 700
                      }}
                    >
                      <Play size={9} fill="currentColor" /> Resume
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))
        ) : (
          <EmptyState
            icon={<Clock size={28} color="var(--nm-text-secondary)" />}
            title="No timeline history yet"
            description="Start browsing learning content on supported sites to populate your timeline."
          />
        )}
      </div>
    </div>
  );
};
