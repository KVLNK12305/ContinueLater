import { useState, useEffect } from 'react';
import { UserSettings, DEFAULT_SETTINGS } from '../types/settings';
import { SettingsStore } from '../storage/settings-store';

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    SettingsStore.get().then((s) => {
      setSettings(s);
      setLoading(false);
      // Apply theme attribute to document element
      document.documentElement.setAttribute('data-theme', s.theme);
    });
  }, []);

  const updateSettings = async (partial: Partial<UserSettings>) => {
    const updated = await SettingsStore.update(partial);
    setSettings(updated);
    if (partial.theme) {
      document.documentElement.setAttribute('data-theme', partial.theme);
    }
  };

  return { settings, loading, updateSettings };
}
