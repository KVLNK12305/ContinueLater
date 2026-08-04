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
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        className="nm-card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '360px',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px',
            borderBottom: '1px solid var(--nm-shadow-dark)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--nm-bg)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={20} color="var(--nm-accent)" />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--nm-text-primary)' }}>Schedule Reminder</h3>
          </div>
          <button onClick={onClose} className="nm-btn-icon" style={{ width: '28px', height: '28px' }}>
            <X size={14} />
          </button>
        </div>

        {/* Selected Item Info */}
        <div style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--nm-text-secondary)', background: 'var(--nm-bg)' }}>
          Item: <strong style={{ color: 'var(--nm-text-primary)' }}>{itemTitle}</strong>
        </div>

        {/* Options List */}
        <div style={{ padding: '0 16px 16px 16px', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto', background: 'var(--nm-bg)' }}>
          {options.map((opt) => {
            const isSelected = selectedOption === opt.key;
            return (
              <label
                key={opt.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: 'var(--nm-radius-md)',
                  backgroundColor: 'var(--nm-bg)',
                  boxShadow: isSelected 
                    ? 'inset 3px 3px 6px var(--nm-shadow-dark), inset -3px -3px 6px var(--nm-shadow-light)'
                    : '3px 3px 6px var(--nm-shadow-dark), -3px -3px 6px var(--nm-shadow-light)',
                  border: isSelected ? '1.5px solid var(--nm-accent)' : '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: isSelected ? 'var(--nm-accent)' : 'var(--nm-text-primary)' }}>
                    {opt.label}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--nm-text-secondary)', marginTop: '2px' }}>
                    {opt.sub}
                  </span>
                </div>
                <input
                  type="radio"
                  name="scheduleOption"
                  checked={isSelected}
                  onChange={() => setSelectedOption(opt.key)}
                  style={{ accentColor: 'var(--nm-accent)', width: '16px', height: '16px' }}
                />
              </label>
            );
          })}

          {selectedOption === 'custom' && (
            <div className="animate-fade-in" style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', color: 'var(--nm-text-primary)', fontWeight: 700 }}>Select Date & Time</label>
              <input
                type="datetime-local"
                value={customDateTime}
                onChange={(e) => setCustomDateTime(e.target.value)}
                className="nm-input"
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '16px',
            borderTop: '1px solid var(--nm-shadow-dark)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            background: 'var(--nm-bg)'
          }}
        >
          <button
            onClick={onClose}
            className="nm-btn nm-btn-secondary"
            style={{ padding: '6px 14px', fontSize: '12px' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="nm-btn nm-btn-primary"
            style={{ padding: '6px 14px', fontSize: '12px' }}
          >
            Set Reminder
          </button>
        </div>
      </div>
    </div>
  );
};
