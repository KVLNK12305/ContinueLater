import React, { useState } from 'react';
import { ScheduleOption } from '../types/enums';
import { AlarmManager } from '../background/alarm-manager';
import { Clock, X } from 'lucide-react';

interface ScheduleModalProps {
  itemId: string;
  itemTitle: string;
  onClose: () => void;
  onScheduled: () => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  itemId,
  itemTitle,
  onClose,
  onScheduled
}) => {
  const [selectedOption, setSelectedOption] = useState<ScheduleOption>('tomorrow');
  const [customDateTime, setCustomDateTime] = useState<string>('');

  const handleSave = async () => {
    const customDate = customDateTime ? new Date(customDateTime) : undefined;
    await AlarmManager.scheduleReminder(itemId, selectedOption, customDate);
    onScheduled();
    onClose();
  };

  const options: { key: ScheduleOption; label: string; sub: string }[] = [
    { key: 'tomorrow', label: 'Tomorrow', sub: 'Same time tomorrow' },
    { key: 'after_lunch', label: 'After Lunch', sub: 'Today at 2:00 PM' },
    { key: 'this_evening', label: 'This Evening', sub: 'Today at 7:00 PM' },
    { key: 'weekend', label: 'This Weekend', sub: 'Saturday at 10:00 AM' },
    { key: 'next_monday', label: 'Next Monday', sub: 'Monday at 9:00 AM' },
    { key: 'custom', label: 'Custom Date & Time', sub: 'Pick specific date & time' },
    { key: 'never', label: 'Never', sub: 'No reminder' }
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(16, 22, 38, 0.8)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        className="painted-card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '360px',
          display: 'flex',
          flexDirection: 'column',
          padding: 0
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: '16px',
            borderBottom: '2px solid var(--color-sky-swirl)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--color-surface)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={20} color="var(--color-moon-yellow)" />
            <h3 className="display-font" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--md-sys-color-on-surface)' }}>Schedule Reminder</h3>
          </div>
          <button onClick={onClose} className="painted-btn-icon painted-interactive" style={{ width: '28px', height: '28px' }}>
            <X size={14} />
          </button>
        </div>

        <div style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--md-sys-color-on-surface-variant)', background: 'var(--color-surface)' }}>
          Item: <strong style={{ color: 'var(--color-moon-yellow)' }}>{itemTitle}</strong>
        </div>

        <div style={{ padding: '0 16px 16px 16px', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto', background: 'var(--color-surface)' }}>
          {options.map((opt) => (
            <label
              key={opt.key}
              className="painted-interactive"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: selectedOption === opt.key ? 'rgba(252, 217, 85, 0.1)' : 'var(--color-surface-elevated)',
                border: selectedOption === opt.key ? '2px solid var(--color-moon-yellow)' : '1px solid var(--color-sky-swirl)',
                boxShadow: selectedOption === opt.key ? 'var(--shadow-glow)' : 'var(--shadow-impasto-base)',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="display-font" style={{ fontSize: '15px', fontWeight: 700, color: selectedOption === opt.key ? 'var(--color-moon-yellow)' : 'var(--md-sys-color-on-surface)' }}>
                  {opt.label}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--md-sys-color-on-surface-variant)', marginTop: '2px' }}>
                  {opt.sub}
                </span>
              </div>
              <input
                type="radio"
                name="scheduleOption"
                checked={selectedOption === opt.key}
                onChange={() => setSelectedOption(opt.key)}
                style={{ accentColor: 'var(--color-moon-yellow)', width: '16px', height: '16px' }}
              />
            </label>
          ))}

          {selectedOption === 'custom' && (
            <div className="animate-fade-in" style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label className="display-font" style={{ fontSize: '13px', color: 'var(--color-moon-yellow)', fontWeight: 700 }}>Select Date & Time</label>
              <input
                type="datetime-local"
                value={customDateTime}
                onChange={(e) => setCustomDateTime(e.target.value)}
                className="painted-input"
              />
            </div>
          )}
        </div>

        <div
          style={{
            padding: '16px',
            borderTop: '2px solid var(--color-sky-swirl)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            background: 'var(--color-surface)'
          }}
        >
          <button
            onClick={onClose}
            className="painted-btn painted-btn-secondary painted-interactive"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="painted-btn painted-btn-primary painted-interactive"
          >
            Set Reminder
          </button>
        </div>
      </div>
    </div>
  );
};
