import React, { useState } from 'react';
import { ScheduleOption } from '../types/enums';
import { AlarmManager } from '../background/alarm-manager';
import { Clock, Calendar, X } from 'lucide-react';

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
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '360px',
          backgroundColor: 'var(--md-sys-color-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--md-sys-color-outline)',
          boxShadow: 'var(--shadow-md)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: '16px',
            borderBottom: '1px solid var(--md-sys-color-outline-variant)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} color="var(--md-sys-color-primary)" />
            <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Schedule Reminder</h3>
          </div>
          <button onClick={onClose} style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--md-sys-color-on-surface-variant)' }}>
          Item: <strong style={{ color: 'var(--md-sys-color-on-surface)' }}>{itemTitle}</strong>
        </div>

        <div style={{ padding: '0 16px 16px 16px', display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
          {options.map((opt) => (
            <label
              key={opt.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid',
                borderColor: selectedOption === opt.key ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline-variant)',
                backgroundColor: selectedOption === opt.key ? 'var(--md-sys-color-primary-container)' : 'transparent',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '13px', fontWeight: 500, color: selectedOption === opt.key ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-surface)' }}>
                  {opt.label}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--md-sys-color-on-surface-variant)' }}>
                  {opt.sub}
                </span>
              </div>
              <input
                type="radio"
                name="scheduleOption"
                checked={selectedOption === opt.key}
                onChange={() => setSelectedOption(opt.key)}
                style={{ accentColor: 'var(--md-sys-color-primary)' }}
              />
            </label>
          ))}

          {selectedOption === 'custom' && (
            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', color: 'var(--md-sys-color-on-surface-variant)' }}>Select Date & Time</label>
              <input
                type="datetime-local"
                value={customDateTime}
                onChange={(e) => setCustomDateTime(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--md-sys-color-outline)',
                  backgroundColor: 'var(--md-sys-color-surface-variant)',
                  color: 'var(--md-sys-color-on-surface)',
                  fontSize: '13px'
                }}
              />
            </div>
          )}
        </div>

        <div
          style={{
            padding: '12px 16px',
            borderTop: '1px solid var(--md-sys-color-outline-variant)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px'
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              color: 'var(--md-sys-color-on-surface-variant)',
              fontSize: '13px'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--md-sys-color-primary)',
              color: 'var(--md-sys-color-on-primary)',
              fontWeight: 600,
              fontSize: '13px'
            }}
          >
            Set Reminder
          </button>
        </div>
      </div>
    </div>
  );
};
