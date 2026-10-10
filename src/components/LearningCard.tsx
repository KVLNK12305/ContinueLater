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
      <div 
        className="animate-fade-in nm-card nm-card-interactive" 
        style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
      >
        <div 
          onClick={() => onResume(item)}
          style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', cursor: 'pointer' }}
          title="Click to resume session"
        >
          {/* Thumbnail / Source Icon Frame */}
          <div
            style={{
              position: 'relative',
              width: '64px',
              height: '48px',
              borderRadius: 'var(--nm-radius-sm)',
              overflow: 'hidden',
              backgroundColor: 'var(--nm-bg)',
              boxShadow: 'inset 2px 2px 4px var(--nm-shadow-dark), inset -2px -2px 4px var(--nm-shadow-light)',
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
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
            ) : item.favicon ? (
              <img src={item.favicon} alt="" style={{ width: '20px', height: '20px' }} />
            ) : (
              <BookOpen size={18} color="var(--nm-accent)" />
            )}

            {/* Source Label Badge */}
            <span
              style={{
                position: 'absolute',
                bottom: 2,
                left: 2,
                fontSize: '8px',
                fontWeight: 800,
                padding: '2px 4px',
                borderRadius: '4px',
                background: 'var(--nm-accent-soft)',
                color: '#ffffff',
                textTransform: 'uppercase'
              }}
            >
              {item.source}
            </span>
          </div>

          {/* Title & Subtitle */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h4
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--nm-text-primary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
              title={item.title}
            >
              {item.title}
            </h4>
            <p
              style={{
                fontSize: '10px',
                color: 'var(--nm-text-secondary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                marginTop: '2px'
              }}
            >
              {item.subtitle || item.url}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--nm-accent)' }}>
                {remainingStr}
              </span>
              {item.scheduledTime && (
                <span style={{ fontSize: '9px', color: 'var(--nm-warning)', display: 'inline-flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
                  <Clock size={10} /> Reminder set
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <CalendarButton item={item} />
            <EmailButton item={item} />
            <button
              onClick={() => setShowScheduleModal(true)}
              title="Schedule Reminder"
              className="nm-btn nm-btn-secondary"
              style={{ fontSize: '11px', padding: '4px 10px' }}
            >
              <Clock size={12} /> Remind
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => onComplete(item)}
              title="Mark as completed"
              className="nm-btn-icon"
              style={{ color: 'var(--nm-success)' }}
            >
              <CheckCircle size={15} />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              title="Delete item"
              className="nm-btn-icon"
              style={{ color: 'var(--nm-danger)' }}
            >
              <Trash2 size={15} />
            </button>
            <button
              onClick={() => onResume(item)}
              className="nm-btn nm-btn-primary"
              style={{ fontSize: '11px', padding: '6px 12px' }}
            >
              <Play size={10} fill="currentColor" style={{ marginRight: '2px' }} /> Resume
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
