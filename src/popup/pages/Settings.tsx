import React, { useState, useEffect } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { LearningStore } from '../../storage/learning-store';
import { generateMarkdownDigest } from '../../utils/resume';
import { Sun, Download, Upload, Keyboard, ShieldAlert, Settings, Archive, FileText } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [storageUsage, setStorageUsage] = useState({ bytes: 0, percent: 0 });
  const [shortcut, setShortcut] = useState('Ctrl+Shift+L');

  // Fetch current storage usage and keyboard shortcut
  const loadStats = () => {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      chrome.storage.local.getBytesInUse(null, (bytes) => {
        const quota = 10485760; // 10MB quota ceiling
        setStorageUsage({ bytes, percent: Math.round((bytes / quota) * 100) });
      });

      if (chrome.commands?.getAll) {
        chrome.commands.getAll((commands) => {
          const cmd = commands.find(c => c.name === 'open-dashboard');
          if (cmd?.shortcut) {
            setShortcut(cmd.shortcut);
          }
        });
      }
    } else {
      // LocalStorage fallback for dev/testing
      const serialized = JSON.stringify(localStorage);
      const bytes = serialized.length;
      const quota = 10485760;
      setStorageUsage({ bytes, percent: Math.round((bytes / quota) * 100) });
    }
  };

  useEffect(() => {
    loadStats();
  }, [settings]);

  const handleExport = async () => {
    const items = await LearningStore.getAll();
    const blob = new Blob([JSON.stringify({ settings, items }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `continue-later-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleExportMarkdown = async () => {
    const items = await LearningStore.getAll();
    const md = generateMarkdownDigest(items);
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `continue-later-digest-${new Date().toISOString().split('T')[0]}.md`;
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

  const handleExportAndClear = async () => {
    const confirmClear = confirm('This will export a backup of all sessions and completely clear your storage. Do you want to proceed?');
    if (!confirmClear) return;

    // 1. Export
    const items = await LearningStore.getAll();
    const backupData = {
      schemaVersion: 2,
      settings,
      items
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `continue-later-export-clear-${new Date().toISOString().split('T')[0]}.json`;
    a.click();

    // 2. Clear
    await LearningStore.clearAll();
    alert('Data exported and local storage cleared successfully.');
    window.location.reload();
  };

  const handleToggleCaptureAny = async (checked: boolean) => {
    if (checked) {
      if (typeof chrome !== 'undefined' && chrome.permissions?.request) {
        try {
          const granted = await chrome.permissions.request({
            origins: ['https://*/*', 'http://*/*', 'file://*/*']
          });
          if (granted) {
            await updateSettings({ captureOnAnySite: true });
            // Send runtime message to background script to register content script immediately
            chrome.runtime.sendMessage({ type: 'REFRESH_DYNAMIC_SCRIPTS' }).catch(() => {});
          } else {
            alert('Host permissions denied. Cannot enable site-wide capture.');
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        await updateSettings({ captureOnAnySite: true });
      }
    } else {
      if (typeof chrome !== 'undefined' && chrome.permissions?.remove) {
        await chrome.permissions.remove({
          origins: ['https://*/*', 'http://*/*', 'file://*/*']
        }).catch(() => {});
      }
      await updateSettings({ captureOnAnySite: false });
      // Send runtime message to background script to unregister content script immediately
      if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
        chrome.runtime.sendMessage({ type: 'REFRESH_DYNAMIC_SCRIPTS' }).catch(() => {});
      }
    }
  };

  const handleOpenShortcuts = () => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
    } else {
      alert('Open chrome://extensions/shortcuts directly in your browser.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '14px', overflowY: 'auto', paddingRight: '4px' }}>
      <div style={{ padding: '0 4px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--nm-text-primary)' }}>
          Preferences
        </h2>
        <p style={{ fontSize: '11px', color: 'var(--nm-text-secondary)', fontStyle: 'italic', marginTop: '2px' }}>
          Configure smart reminders, themes, and thresholds
        </p>
      </div>

      {/* Storage Quota Warning Banner */}
      {storageUsage.percent >= 80 && (
        <div 
          style={{ 
            padding: '12px 14px', 
            borderRadius: 'var(--nm-radius-sm)', 
            backgroundColor: 'var(--nm-bg)',
            boxShadow: 'inset 3px 3px 6px var(--nm-shadow-dark), inset -3px -3px 6px var(--nm-shadow-light)',
            border: '1.5px solid var(--nm-danger)',
            color: 'var(--nm-danger)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '11px',
            fontWeight: 700
          }}
        >
          <ShieldAlert size={16} />
          <span>Storage Warning: local space is {storageUsage.percent}% full ({Math.round(storageUsage.bytes / 1024)} KB used). Perform an "Export & Clear".</span>
        </div>
      )}

      {/* Theme Selection */}
      <div className="nm-card" style={sectionStyle}>
        <h3 style={sectionTitleStyle}>
          <Sun size={14} color="var(--nm-accent)" /> Theme & Aesthetics
        </h3>
        <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
          {(['retro', 'light', 'dark', 'system'] as const).map((t) => (
            <button
              key={t}
              onClick={() => updateSettings({ theme: t })}
              className={`nm-chip ${settings.theme === t ? 'nm-chip-active' : ''}`}
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
      <div className="nm-card" style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Default Reminder Schedule</h3>
        <select
          value={settings.defaultReminderSchedule}
          onChange={(e) => updateSettings({ defaultReminderSchedule: e.target.value as any })}
          className="nm-input"
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

      {/* Capture Behavior Settings */}
      <div className="nm-card" style={sectionStyle}>
        <h3 style={sectionTitleStyle}>
          <Settings size={14} color="var(--nm-accent)" /> Capture Options
        </h3>
        <label 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            cursor: 'pointer', 
            fontSize: '12px',
            color: 'var(--nm-text-primary)',
            padding: '4px 0'
          }}
        >
          <span>Capture learning on any website (opt-in)</span>
          <input
            type="checkbox"
            checked={settings.captureOnAnySite || false}
            onChange={(e) => handleToggleCaptureAny(e.target.checked)}
            style={{ accentColor: 'var(--nm-accent)', width: '16px', height: '16px' }}
          />
        </label>
      </div>

      {/* Auto Archiving Config */}
      <div className="nm-card" style={sectionStyle}>
        <h3 style={sectionTitleStyle}>
          <Archive size={14} color="var(--nm-accent)" /> Auto Archiving
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              cursor: 'pointer', 
              fontSize: '12px',
              color: 'var(--nm-text-primary)'
            }}
          >
            <span>Enable auto-archiving of completed sessions</span>
            <input
              type="checkbox"
              checked={settings.enableAutoArchive !== false}
              onChange={(e) => updateSettings({ enableAutoArchive: e.target.checked })}
              style={{ accentColor: 'var(--nm-accent)', width: '16px', height: '16px' }}
            />
          </label>
          {settings.enableAutoArchive !== false && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <span style={{ fontSize: '11px', color: 'var(--nm-text-secondary)' }}>Archive completion age:</span>
              <select
                value={settings.autoArchiveDays}
                onChange={(e) => updateSettings({ autoArchiveDays: parseInt(e.target.value, 10) || 7 })}
                className="nm-input"
                style={{ padding: '6px 12px', fontSize: '12px', width: '120px' }}
              >
                <option value="1">1 Day</option>
                <option value="3">3 Days</option>
                <option value="7">7 Days</option>
                <option value="14">14 Days</option>
                <option value="30">30 Days</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Completion Thresholds */}
      <div className="nm-card" style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Completion Thresholds (%)</h3>
        <p style={{ fontSize: '10px', color: 'var(--nm-text-secondary)', fontStyle: 'italic', marginBottom: '2px' }}>
          Session completes once progress exceeds threshold:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '4px' }}>
          <div>
            <label style={labelStyle}>YouTube Video</label>
            <input
              type="number"
              value={settings.thresholds.youtube}
              onChange={(e) => updateSettings({ thresholds: { ...settings.thresholds, youtube: parseInt(e.target.value) || 90 } })}
              className="nm-input"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Articles & Blogs</label>
            <input
              type="number"
              value={settings.thresholds.article}
              onChange={(e) => updateSettings({ thresholds: { ...settings.thresholds, article: parseInt(e.target.value) || 95 } })}
              className="nm-input"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>GitHub Repos</label>
            <input
              type="number"
              value={settings.thresholds.github}
              onChange={(e) => updateSettings({ thresholds: { ...settings.thresholds, github: parseInt(e.target.value) || 95 } })}
              className="nm-input"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>PDF Documents</label>
            <input
              type="number"
              value={settings.thresholds.pdf}
              onChange={(e) => updateSettings({ thresholds: { ...settings.thresholds, pdf: parseInt(e.target.value) || 95 } })}
              className="nm-input"
              style={inputStyle}
            />
          </div>
        </div>
      </div>

      {/* Backup & Data */}
      <div className="nm-card" style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Data Export & Import</h3>
        <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
          <button onClick={handleExport} className="nm-btn nm-btn-secondary" style={{ flex: 1, padding: '8px' }}>
            <Download size={13} /> JSON Backup
          </button>
          <button onClick={handleExportMarkdown} className="nm-btn nm-btn-secondary" style={{ flex: 1, padding: '8px' }}>
            <FileText size={13} /> Markdown Digest
          </button>
          <label className="nm-btn nm-btn-secondary" style={{ flex: 1, cursor: 'pointer', padding: '8px' }}>
            <Upload size={13} /> Import
            <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
          </label>
        </div>
        <button 
          onClick={handleExportAndClear} 
          className="nm-btn" 
          style={{ 
            marginTop: '8px', 
            padding: '8px', 
            color: 'var(--nm-danger)', 
            borderColor: 'var(--nm-danger)',
            fontSize: '12px'
          }}
        >
          🗑️ Export & Clear All Storage
        </button>
      </div>

      {/* Keyboard Shortcut Info */}
      <div className="nm-card" style={sectionStyle}>
        <h3 style={sectionTitleStyle}>
          <Keyboard size={14} color="var(--nm-accent)" /> Keyboard Shortcut
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginTop: '4px' }}>
          <p style={{ fontSize: '11px', color: 'var(--nm-text-secondary)', lineHeight: 1.4 }}>
            Press <kbd className="nm-chip" style={{ padding: '2px 8px', fontSize: '9px', fontWeight: 800 }}>{shortcut}</kbd> to open dashboard instantly.
          </p>
          <button 
            onClick={handleOpenShortcuts}
            className="nm-btn nm-btn-secondary"
            style={{ padding: '4px 10px', fontSize: '10px' }}
          >
            Configure
          </button>
        </div>
      </div>
    </div>
  );
};

const sectionStyle: React.CSSProperties = {
  padding: '14px 12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px'
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 700,
  color: 'var(--nm-text-primary)',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const labelStyle: React.CSSProperties = {
  fontSize: '10px',
  color: 'var(--nm-accent)',
  fontWeight: 700,
  display: 'block',
  marginBottom: '4px'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '6px 12px',
  fontSize: '12px'
};
