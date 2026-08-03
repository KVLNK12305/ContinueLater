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
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : defaultValue;
}

async function setStorageData<T>(key: string, value: T): Promise<void> {
  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, () => resolve());
    });
  }
  localStorage.setItem(key, JSON.stringify(value));
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

    if (existingIndex >= 0) {
      items[existingIndex] = {
        ...items[existingIndex],
        ...item,
        lastSeen: Date.now()
      };
    } else {
      items.unshift(item);
    }

    await setStorageData(STORAGE_KEY, items);
    return item;
  }

  static async updateStatus(id: string, status: LearningObject['status'], scheduledTime?: number): Promise<void> {
    const items = await this.getAll();
    const item = items.find((i) => i.id === id);
    if (item) {
      item.status = status;
      if (scheduledTime) item.scheduledTime = scheduledTime;
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
}
