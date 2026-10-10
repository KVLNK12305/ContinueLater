import { LearningObject } from '../types/learning-object';

const STORAGE_KEY = 'continue_later_items';

/**
 * Storage wrapper using chrome.storage.local with localStorage fallback for testing
 */
async function getStorageData<T>(key: string, defaultValue: T): Promise<T> {
  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    return new Promise((resolve) => {
      chrome.storage.local.get([key], (result) => {
        resolve(result[key] !== undefined ? result[key] : defaultValue);
      });
    });
  }
  try {
    if (typeof localStorage !== 'undefined' && localStorage) {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : defaultValue;
    }
  } catch {
    // Ignore storage errors in restricted test environments
  }
  return defaultValue;
}

async function setStorageData<T>(key: string, value: T): Promise<void> {
  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, () => resolve());
    });
  }
  try {
    if (typeof localStorage !== 'undefined' && localStorage) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch {
    // Ignore storage errors in restricted test environments
  }
}

export class LearningStore {
  static async getAll(): Promise<LearningObject[]> {
    return getStorageData<LearningObject[]>(STORAGE_KEY, []);
  }

  static async getById(id: string): Promise<LearningObject | null> {
    const items = await this.getAll();
    return items.find((item) => item.id === id) || null;
  }

  static async getByUrl(url: string): Promise<LearningObject | null> {
    const items = await this.getAll();
    // Normalize URL comparison (strip trailing slashes/hashes)
    const cleanUrl = url.split('#')[0].replace(/\/$/, '');
    return items.find((item) => item.url.split('#')[0].replace(/\/$/, '') === cleanUrl) || null;
  }

  static async save(item: LearningObject): Promise<LearningObject> {
    const items = await this.getAll();
    const existingIndex = items.findIndex((existing) => existing.id === item.id || existing.url === item.url);

    const itemToSave = {
      ...item,
      schemaVersion: 2,
      lastSeen: Date.now()
    };

    if (existingIndex >= 0) {
      items[existingIndex] = {
        ...items[existingIndex],
        ...itemToSave
      };
    } else {
      items.unshift(itemToSave);
    }

    await setStorageData(STORAGE_KEY, items);
    return itemToSave;
  }

  static async updateStatus(id: string, status: LearningObject['status'], scheduledTime?: number): Promise<void> {
    const items = await this.getAll();
    const item = items.find((i) => i.id === id);
    if (item) {
      item.status = status;
      if (scheduledTime !== undefined) {
        item.scheduledTime = scheduledTime;
      } else if (status !== 'snoozed') {
        delete item.scheduledTime;
      }
      item.lastSeen = Date.now();
      await setStorageData(STORAGE_KEY, items);
    }
  }

  static async delete(id: string): Promise<void> {
    const items = await this.getAll();
    const filtered = items.filter((item) => item.id !== id);
    await setStorageData(STORAGE_KEY, filtered);
  }

  static async clearCompleted(): Promise<void> {
    const items = await this.getAll();
    const activeOnly = items.filter((item) => item.status !== 'completed');
    await setStorageData(STORAGE_KEY, activeOnly);
  }

  static async clearAll(): Promise<void> {
    await setStorageData(STORAGE_KEY, []);
  }

  static async archiveOldCompletedItems(autoArchiveDays: number): Promise<void> {
    if (autoArchiveDays <= 0) return;
    const items = await this.getAll();
    const now = Date.now();
    const thresholdTime = now - autoArchiveDays * 24 * 60 * 60 * 1000;
    
    let modified = false;
    const updated = items.map((item) => {
      if (item.status === 'completed' && item.lastSeen < thresholdTime) {
        modified = true;
        return { ...item, status: 'archived' as const, lastSeen: now };
      }
      return item;
    });

    if (modified) {
      await setStorageData(STORAGE_KEY, updated);
    }
  }
}
