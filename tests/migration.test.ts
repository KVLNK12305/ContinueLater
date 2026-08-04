import { describe, it, expect, beforeEach } from 'vitest';
import { migrateStorageIfNeeded } from '../src/storage/migration';
import { LearningStore } from '../src/storage/learning-store';

// Custom localStorage mock to avoid Node native/JSDOM conflicts
const store: Record<string, string> = {};
const mockLocalStorage = {
  getItem: (key: string) => store[key] || null,
  setItem: (key: string, value: string) => { store[key] = value; },
  removeItem: (key: string) => { delete store[key]; },
  clear: () => {
    for (const key of Object.keys(store)) {
      delete store[key];
    }
  },
  key: (index: number) => Object.keys(store)[index] || null,
  get length() { return Object.keys(store).length; }
};

if (typeof global !== 'undefined') {
  Object.defineProperty(global, 'localStorage', {
    value: mockLocalStorage,
    writable: true
  });
}
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true
  });
}

describe('Schema Migrations', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('runs migrations sequentially and sets version key', async () => {
    // Initially mock some old format item
    const mockOldItem = {
      id: 'test_old',
      title: 'Old Title',
      url: 'https://example.com'
    };
    
    // Save to storage
    localStorage.setItem('continue_later_items', JSON.stringify([mockOldItem]));
    
    // Check initial version is missing
    expect(localStorage.getItem('continue_later_schema_version')).toBeNull();

    // Trigger migration
    await migrateStorageIfNeeded();

    // Verify it updated schema version to version 2
    expect(localStorage.getItem('continue_later_schema_version')).toBe('2');

    // Verify items were migrated to include v1 fields
    const items = await LearningStore.getAll();
    expect(items.length).toBe(1);
    expect(items[0].status).toBe('unfinished');
    expect(items[0].firstSeen).toBeDefined();
    expect(items[0].tags).toEqual([]);
  });
});
