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
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--md-sys-color-on-surface)' }}>
          Learning Timeline
        </h2>
        <p style={{ fontSize: '10px', color: 'var(--md-sys-color-on-surface-variant)' }}>
          Chronological history of your learning sessions
        </p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', paddingRight: '2px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '24px', fontSize: '12px' }}>Loading timeline...</div>
        ) : groupedTimeline.length > 0 ? (
          groupedTimeline.map(([groupTitle, groupItems]) => (
            <div key={groupTitle} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--md-sys-color-primary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  paddingLeft: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Calendar size={12} /> {groupTitle}
              </div>

              {groupItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--md-sys-color-surface-variant)',
                    border: '1px solid var(--md-sys-color-outline-variant)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                    <ProgressRing progress={item.completionPercent} showText size={32} />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <h4
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: 'var(--md-sys-color-on-surface)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {item.title}
                      </h4>
                      <p style={{ fontSize: '10px', color: 'var(--md-sys-color-on-surface-variant)' }}>
                        {item.source.toUpperCase()} · {formatRemainingTime(item.estimatedRemainingMinutes)}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      onClick={() => deleteItem(item.id)}
                      title="Delete"
                      style={{ padding: '4px', color: 'var(--md-sys-color-on-surface-variant)' }}
                    >
                      <Trash2 size={14} />
                    </button>
                    <button
                      onClick={() => resumeItem(item)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--md-sys-color-primary)',
                        color: 'var(--md-sys-color-on-primary)',
                        fontSize: '11px',
                        fontWeight: 600
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
            icon={<Clock size={32} color="var(--md-sys-color-primary)" />}
            title="No timeline history yet"
            description="Start browsing learning content on supported sites to populate your timeline."
          />
        )}
      </div>
    </div>
  );
};
