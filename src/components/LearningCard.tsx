import React, { useState } from 'react';
import { LearningObject } from '../types/learning-object';
import { ProgressRing } from './ProgressRing';
import { CalendarButton } from './CalendarButton';
import { EmailButton } from './EmailButton';
import { ScheduleModal } from './ScheduleModal';
import { formatRemainingTime } from '../utils/time';
import { Play, CheckCircle, Trash2, Clock, BookOpen } from 'lucide-react';

interface LearningCardProps {
  item: LearningObject;
  onResume: (item: LearningObject) => void;
  onDelete: (id: string) => void;
  onComplete: (item: LearningObject) => void;
  onRefresh?: () => void;
}

export const LearningCard: React.FC<LearningCardProps> = ({
  item,
  onResume,
  onDelete,
  onComplete,
  onRefresh
}) => {
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const remainingStr = formatRemainingTime(item.estimatedRemainingMinutes);

  return (
    <>
      <div className="animate-fade-in painted-card painted-card-interactive" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          {/* Thumbnail / Source Icon with Painted frame */}
          <div
            style={{
              position: 'relative',
              width: '64px',
              height: '48px',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              backgroundColor: 'var(--color-canvas-bg)',
              boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.8)',
              border: '1px solid var(--color-sky-swirl)',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {item.thumbnail ? (
              <img
                src={item.thumbnail}
                alt={item.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.1) saturate(1.2)' }}
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
            ) : item.favicon ? (
              <img src={item.favicon} alt="" style={{ width: '24px', height: '24px' }} />
            ) : (
              <BookOpen size={20} color="var(--md-sys-color-primary)" />
            )}

            {/* Source Label Badge */}
            <span
              className="display-font"
              style={{
                position: 'absolute',
                bottom: 3,
                left: 3,
                fontSize: '9px',
                fontWeight: 800,
                padding: '2px 5px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--gradient-accent)',
                color: '#2a2212',
                textTransform: 'uppercase',
                boxShadow: 'var(--shadow-impasto-base)'
              }}
            >
              {item.source}
            </span>
          </div>

          {/* Title & Subtitle */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h4
              className="display-font"
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: 'var(--md-sys-color-on-surface)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textShadow: '1px 1px 0 rgba(0,0,0,0.5)'
              }}
              title={item.title}
            >
              {item.title}
            </h4>
            <p
              style={{
                fontSize: '11px',
                color: 'var(--md-sys-color-on-surface-variant)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                marginTop: '2px'
              }}
            >
              {item.subtitle || item.url}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
              <span className="painted-text-accent" style={{ fontSize: '11px', fontWeight: 700 }}>
                {remainingStr}
              </span>
              {item.scheduledTime && (
                <span style={{ fontSize: '10px', color: 'var(--md-sys-color-warning)', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                  <Clock size={10} /> Remind set
                </span>
              )}
            </div>
          </div>

          {/* Progress Ring */}
          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <ProgressRing progress={item.completionPercent} showText />
          </div>
        </div>

        {/* Action Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <CalendarButton item={item} />
            <EmailButton item={item} />
            <button
              onClick={() => setShowScheduleModal(true)}
              title="Schedule Reminder"
              className="painted-btn painted-btn-secondary painted-interactive"
              style={{ fontSize: '11px', padding: '4px 10px' }}
            >
              <Clock size={12} /> Remind
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => onComplete(item)}
              title="Mark as completed"
              className="painted-btn-icon painted-interactive"
              style={{ color: 'var(--md-sys-color-success)' }}
            >
              <CheckCircle size={15} />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              title="Delete item"
              className="painted-btn-icon painted-interactive"
              style={{ color: 'var(--md-sys-color-error)' }}
            >
              <Trash2 size={15} />
            </button>
            <button
              onClick={() => onResume(item)}
              className="painted-btn painted-btn-primary painted-interactive"
              style={{ fontSize: '12px', padding: '6px 14px' }}
            >
              <Play size={12} fill="currentColor" /> Resume
            </button>
          </div>
        </div>
      </div>

      {showScheduleModal && (
        <ScheduleModal
          itemId={item.id}
          itemTitle={item.title}
          onClose={() => setShowScheduleModal(false)}
          onScheduled={() => onRefresh && onRefresh()}
        />
      )}
    </>
  );
};
