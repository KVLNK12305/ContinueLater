import React from 'react';
import { useSettings } from '../../hooks/useSettings';
import { LearningStore } from '../../storage/learning-store';
import { Settings, Moon, Sun, Download, Upload, Keyboard, ShieldCheck } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings } = useSettings();

  const handleExport = async () => {
    const items = await LearningStore.getAll();
    const blob = new Blob([JSON.stringify({ settings, items }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `continue-later-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const data = JSON.parse(evt.target?.result as string);
        if (data.items && Array.isArray(data.items)) {
          for (const item of data.items) {
            await LearningStore.save(item);
          }
          alert('Successfully imported learning data!');
          window.location.reload();
        }
      } catch (err) {
        alert('Failed to parse backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px', overflowY: 'auto', paddingRight: '2px' }}>
      <div style={{ padding: '0 4px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--md-sys-color-on-surface)' }}>
          Preferences & Controls
        </h2>
        <p style={{ fontSize: '10px', color: 'var(--md-sys-color-on-surface-variant)' }}>
          Configure smart reminders, themes, and completion thresholds
        </p>
      </div>

      {/* Theme Selection */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>
          <Sun size={14} /> Theme & Aesthetics
        </h3>
        <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
          {(['dark', 'light', 'system'] as const).map((t) => (
            <button
              key={t}
              onClick={() => updateSettings({ theme: t })}
              style={{
                flex: 1,
                padding: '6px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid',
                borderColor: settings.theme === t ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline-variant)',
                backgroundColor: settings.theme === t ? 'var(--md-sys-color-primary-container)' : 'transparent',
                color: settings.theme === t ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-surface)',
                fontSize: '12px',
                textTransform: 'capitalize'
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Default Schedule */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Default Reminder Schedule</h3>
        <select
          value={settings.defaultReminderSchedule}
          onChange={(e) => updateSettings({ defaultReminderSchedule: e.target.value as any })}
          style={inputStyle}
        >
          <option value="tomorrow">Tomorrow (Same time)</option>
          <option value="after_lunch">After Lunch (2:00 PM)</option>
          <option value="this_evening">This Evening (7:00 PM)</option>
          <option value="weekend">This Weekend (Saturday)</option>
          <option value="next_monday">Next Monday (9:00 AM)</option>
          <option value="never">Never</option>
        </select>
      </div>

      {/* Completion Thresholds */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Completion Thresholds (%)</h3>
        <p style={{ fontSize: '10px', color: 'var(--md-sys-color-on-surface-variant)' }}>
          Session becomes completed when progress exceeds threshold:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginTop: '6px' }}>
          <div>
            <label style={labelStyle}>YouTube Video (%)</label>
            <input
              type="number"
              value={settings.thresholds.youtube}
              onChange={(e) => updateSettings({ thresholds: { ...settings.thresholds, youtube: parseInt(e.target.value) || 90 } })}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Articles & Blogs (%)</label>
            <input
              type="number"
              value={settings.thresholds.article}
              onChange={(e) => updateSettings({ thresholds: { ...settings.thresholds, article: parseInt(e.target.value) || 95 } })}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>GitHub Repos & README (%)</label>
            <input
              type="number"
              value={settings.thresholds.github}
              onChange={(e) => updateSettings({ thresholds: { ...settings.thresholds, github: parseInt(e.target.value) || 95 } })}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>PDF Documents (%)</label>
            <input
              type="number"
              value={settings.thresholds.pdf}
              onChange={(e) => updateSettings({ thresholds: { ...settings.thresholds, pdf: parseInt(e.target.value) || 95 } })}
              style={inputStyle}
            />
          </div>
        </div>
      </div>

      {/* Backup & Data */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Data Export & Import</h3>
        <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
          <button onClick={handleExport} style={buttonSecondaryStyle}>
            <Download size={12} /> Export Data JSON
          </button>
          <label style={{ ...buttonSecondaryStyle, cursor: 'pointer' }}>
            <Upload size={12} /> Import Data
            <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      {/* Keyboard Shortcut Info */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>
          <Keyboard size={14} /> Keyboard Shortcut
        </h3>
        <p style={{ fontSize: '11px', color: 'var(--md-sys-color-on-surface-variant)' }}>
          Press <kbd style={{ padding: '2px 6px', borderRadius: '4px', background: 'var(--md-sys-color-surface-variant)', border: '1px solid var(--md-sys-color-outline)' }}>Ctrl+Shift+L</kbd> anywhere to open dashboard instantly.
        </p>
      </div>
    </div>
  );
};

const sectionStyle: React.CSSProperties = {
  padding: '12px',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'var(--md-sys-color-surface-variant)',
  border: '1px solid var(--md-sys-color-outline-variant)',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 600,
  color: 'var(--md-sys-color-on-surface)',
  display: 'flex',
  alignItems: 'center',
  gap: '6px'
};

const labelStyle: React.CSSProperties = {
  fontSize: '10px',
  color: 'var(--md-sys-color-on-surface-variant)'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '6px 10px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--md-sys-color-outline-variant)',
  backgroundColor: 'var(--md-sys-color-surface)',
  color: 'var(--md-sys-color-on-surface)',
  fontSize: '12px',
  marginTop: '2px'
};

const buttonSecondaryStyle: React.CSSProperties = {
  flex: 1,
  padding: '6px 10px',
  borderRadius: 'var(--radius-sm)',
  backgroundColor: 'var(--md-sys-color-surface)',
  border: '1px solid var(--md-sys-color-outline-variant)',
  color: 'var(--md-sys-color-on-surface)',
  fontSize: '11px',
  fontWeight: 500,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px'
};
