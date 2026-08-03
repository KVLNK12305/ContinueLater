import { UserSettings, DEFAULT_SETTINGS } from '../types/settings';

const SETTINGS_KEY = 'continue_later_settings';

export class SettingsStore {
  static async get(): Promise<UserSettings> {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      return new Promise((resolve) => {
        chrome.storage.local.get([SETTINGS_KEY], (res) => {
          resolve(res[SETTINGS_KEY] ? { ...DEFAULT_SETTINGS, ...res[SETTINGS_KEY] } : DEFAULT_SETTINGS);
        });
      });
    }
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  }

  static async update(partial: Partial<UserSettings>): Promise<UserSettings> {
    const current = await this.get();
    const updated = { ...current, ...partial };
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      await new Promise<void>((resolve) => {
        chrome.storage.local.set({ [SETTINGS_KEY]: updated }, () => resolve());
      });
    } else {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    }
    return updated;
  }
}
