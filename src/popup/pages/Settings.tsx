import React from 'react';
import { useSettings } from '../../hooks/useSettings';
import { LearningStore } from '../../storage/learning-store';
import { Sun, Download, Upload, Keyboard } from 'lucide-react';

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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '14px', overflowY: 'auto', paddingRight: '4px' }}>
      <div style={{ padding: '0 4px' }}>
        <h2 className="display-font" style={{ fontSize: '20px', fontWeight: 800, color: 'var(--md-sys-color-on-surface)' }}>
          Preferences
        </h2>
        <p style={{ fontSize: '11px', color: 'var(--md-sys-color-on-surface-variant)', fontStyle: 'italic' }}>
          Configure smart reminders, themes, and thresholds
        </p>
      </div>

      {/* Theme Selection */}
      <div className="painted-card animate-fade-in" style={sectionStyle}>
        <h3 className="display-font" style={sectionTitleStyle}>
          <Sun size={14} color="var(--color-moon-yellow)" /> Theme & Aesthetics
        </h3>
        <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
          {(['dark', 'light', 'system'] as const).map((t) => (
            <button
              key={t}
              onClick={() => updateSettings({ theme: t })}
              className={`painted-chip ${settings.theme === t ? 'painted-chip-active' : ''}`}
              style={{
                flex: 1,
                padding: '8px',
                fontSize: '12px',
                justifyContent: 'center',
                textTransform: 'capitalize'
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Default Schedule */}
      <div className="painted-card animate-fade-in" style={sectionStyle}>
        <h3 className="display-font" style={sectionTitleStyle}>Default Reminder Schedule</h3>
        <select
          value={settings.defaultReminderSchedule}
          onChange={(e) => updateSettings({ defaultReminderSchedule: e.target.value as any })}
          className="painted-input"
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
      <div className="painted-card animate-fade-in" style={sectionStyle}>
        <h3 className="display-font" style={sectionTitleStyle}>Completion Thresholds (%)</h3>
        <p style={{ fontSize: '11px', color: 'var(--md-sys-color-on-surface-variant)', fontStyle: 'italic' }}>
          Session becomes completed when progress exceeds threshold:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '6px' }}>
          <div>
            <label style={labelStyle}>YouTube Video</label>
            <input
              type="number"
              value={settings.thresholds.youtube}
              onChange={(e) => updateSettings({ thresholds: { ...settings.thresholds, youtube: parseInt(e.target.value) || 90 } })}
              className="painted-input"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Articles & Blogs</label>
            <input
              type="number"
              value={settings.thresholds.article}
              onChange={(e) => updateSettings({ thresholds: { ...settings.thresholds, article: parseInt(e.target.value) || 95 } })}
              className="painted-input"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>GitHub Repos</label>
            <input
              type="number"
              value={settings.thresholds.github}
              onChange={(e) => updateSettings({ thresholds: { ...settings.thresholds, github: parseInt(e.target.value) || 95 } })}
              className="painted-input"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>PDF Documents</label>
            <input
              type="number"
              value={settings.thresholds.pdf}
              onChange={(e) => updateSettings({ thresholds: { ...settings.thresholds, pdf: parseInt(e.target.value) || 95 } })}
              className="painted-input"
              style={inputStyle}
            />
          </div>
        </div>
      </div>

      {/* Backup & Data */}
      <div className="painted-card animate-fade-in" style={sectionStyle}>
        <h3 className="display-font" style={sectionTitleStyle}>Data Export & Import</h3>
        <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
          <button onClick={handleExport} className="painted-btn painted-btn-secondary painted-interactive" style={{ flex: 1, padding: '8px' }}>
            <Download size={14} /> Export Data
          </button>
          <label className="painted-btn painted-btn-secondary painted-interactive" style={{ flex: 1, cursor: 'pointer', padding: '8px' }}>
            <Upload size={14} /> Import Data
            <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      {/* Keyboard Shortcut Info */}
      <div className="painted-card animate-fade-in" style={sectionStyle}>
        <h3 className="display-font" style={sectionTitleStyle}>
          <Keyboard size={14} color="var(--color-moon-yellow)" /> Keyboard Shortcut
        </h3>
        <p style={{ fontSize: '11px', color: 'var(--md-sys-color-on-surface-variant)', lineHeight: 1.5 }}>
          Press <kbd className="painted-chip" style={{ padding: '2px 8px', fontSize: '10px', fontWeight: 800 }}>Ctrl+Shift+L</kbd> anywhere to open dashboard instantly.
        </p>
      </div>
    </div>
  );
};

const sectionStyle: React.CSSProperties = {
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px'
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '15px',
  fontWeight: 700,
  color: 'var(--md-sys-color-on-surface)',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const labelStyle: React.CSSProperties = {
  fontSize: '11px',
  color: 'var(--color-moon-yellow)',
  fontWeight: 700,
  display: 'block',
  marginBottom: '4px'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 14px',
  fontSize: '13px'
};
