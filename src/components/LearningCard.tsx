import React, { useState } from 'react';
import { LearningObject } from '../types/learning-object';
import { ProgressRing } from './ProgressRing';
import { CalendarButton } from './CalendarButton';
import { EmailButton } from './EmailButton';
import { ScheduleModal } from './ScheduleModal';
import { formatRemainingTime } from '../utils/time';
import { Play, CheckCircle, Trash2, Clock, ExternalLink, MoreVertical, BookOpen } from 'lucide-react';

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
  const [showMenu, setShowMenu] = useState(false);

  const remainingStr = formatRemainingTime(item.estimatedRemainingMinutes);

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'youtube': return '#ef4444';
      case 'github': return '#a855f7';
      case 'medium': return '#10b981';
      case 'substack': return '#f97316';
      case 'wikipedia': return '#3b82f6';
      case 'pdf': return '#e11d48';
      default: return '#6366f1';
    }
  };

  return (
    <>
      <div
        className="animate-fade-in"
        style={{
          position: 'relative',
          padding: '12px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          backdropFilter: 'var(--glass-backdrop)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          transition: 'all 0.2s ease',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          {/* Thumbnail / Source Icon */}
          <div
            style={{
              position: 'relative',
              width: '64px',
              height: '48px',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              backgroundColor: 'var(--md-sys-color-surface-variant)',
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
              <img src={item.favicon} alt="" style={{ width: '24px', height: '24px' }} />
            ) : (
              <BookOpen size={20} color="var(--md-sys-color-primary)" />
            )}

            {/* Source Label Badge */}
            <span
              style={{
                position: 'absolute',
                bottom: 2,
                left: 2,
                fontSize: '8px',
                fontWeight: 700,
                padding: '1px 4px',
                borderRadius: '3px',
                backgroundColor: getSourceBadgeColor(item.source),
                color: '#fff',
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
                fontWeight: 600,
                color: 'var(--md-sys-color-on-surface)',
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <span style={{ fontSize: '10px', color: 'var(--md-sys-color-primary)', fontWeight: 600 }}>
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
          <div style={{ display: 'flex', gap: '6px' }}>
            <CalendarButton item={item} />
            <EmailButton item={item} />
            <button
              onClick={() => setShowScheduleModal(true)}
              title="Schedule Reminder"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--md-sys-color-surface-variant)',
                color: 'var(--md-sys-color-on-surface-variant)',
                border: '1px solid var(--md-sys-color-outline-variant)'
              }}
            >
              <Clock size={12} />
              <span>Remind</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => onComplete(item)}
              title="Mark as completed"
              style={{
                padding: '4px',
                color: 'var(--md-sys-color-on-surface-variant)',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              <CheckCircle size={16} />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              title="Delete item"
              style={{
                padding: '4px',
                color: 'var(--md-sys-color-on-surface-variant)',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={() => onResume(item)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                fontWeight: 600,
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--md-sys-color-primary)',
                color: 'var(--md-sys-color-on-primary)',
                boxShadow: 'var(--shadow-glow)'
              }}
            >
              <Play size={12} fill="currentColor" />
              <span>Resume</span>
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
